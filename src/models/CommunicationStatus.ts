// Core Types
export type EventRange = { endRange: number, count: number };

// Event Types
type BaseEvent<T extends string> = {
    type: T,
    events: EventRange
}
type RecoverEvent = BaseEvent<'recover'>;
type NotifyEvent = BaseEvent<'notify'>;
type HeartBeatEvent = { type: 'heartbeat', eventsEndRange: number }
type HeartBeatMissEvent = { type: 'heartbeat-miss' }
export type CommEvent = RecoverEvent | NotifyEvent | HeartBeatEvent | HeartBeatMissEvent;

// State Types
type BaseState<T extends string> = {
    type: T,
    lastReceived: number
};

type EventGenerator = Generator<EventRange, number>;
type MissingEventsState<T extends string> = BaseState<T> & {
    missingEvents: EventGenerator
}
type Connected = BaseState<'connected'>;
type MissedMessages = MissingEventsState<'missed-messages'>;
type BrokenConnection = BaseState<'broken-connection'>;
type BrokenAndMissed = MissingEventsState<'broken-and-missed'>;
export type CommState = Connected | MissedMessages | BrokenConnection | BrokenAndMissed;

type CommStateResult = {
    error: false,
    commState: CommState
} | {
    error: true,
    message: string
}

export function reducer(state: CommState, action: CommEvent): CommStateResult {
    switch (action.type) {
        case 'heartbeat-miss':
            return {
                error: false,
                commState: handleHeartbeatMiss(state)
            };
        case 'heartbeat':
            return action.eventsEndRange < 0
                ? { error: true, message: 'eventsSinceSubscriptionStart cannot be less than 0: ' + action.eventsEndRange }
                : { error: false, commState: handleHeartbeat(state, action.eventsEndRange)}
        case 'notify':
        case 'recover':
            const { events } = action;
            const maybeError: string | undefined =
                events.endRange < 0
                    ? 'eventsSinceSubscriptionStart cannot be less than 0: ' + events.endRange
                    : (events.endRange - events.count) < 0
                        ? `event indicated negative events. eventsSinceSubscriptionStart=${events.endRange} and eventsInNotification=${events.count}`
                        : events.count < 0
                            ? 'eventsInNotification cannt be less than 0: ' + events.count
                            : undefined;
            // Both can remove missing events
            if (!!maybeError) {
                return {
                    error: true,
                    message: maybeError
                }
            } else {
                const eventStart = events.endRange - events.count;
                const maybeNewMissing =
                    applyToRightLedge<EventRange | undefined>(
                        { endRange: state.lastReceived, count: state.lastReceived },
                        events,
                        // Full overlap, no missing
                        () => undefined,
                        // Missing range
                        (count) => { return { count, endRange: eventStart } },
                        // Left overhang, we'll take care of this on removal
                        (_) => undefined
                    );
                const maybePriorMissing = applyByMissed<GeneratorRemoveResult>(
                    state,
                    (priorMissing) => tryRemoveRangeFromGenerator(priorMissing, events),
                    () => { return { empty: true } }
                );
                const maybeMissing: EventGenerator | undefined = !!maybeNewMissing
                    ? maybePriorMissing.empty
                        ? createGenerator(maybeNewMissing) : addRangeToGenerator(maybePriorMissing.generator, maybeNewMissing)
                    : maybePriorMissing.empty
                        ? undefined : maybePriorMissing.generator;
                
                switch (action.type) {
                    case 'notify':
                        return {
                            error: false,
                            commState: handleNotify(state, events, maybeMissing)
                        };
                    case 'recover':
                        return {
                            error: false,
                            commState: handleRecover(state, events, maybeMissing)
                        };
                }
            }
    }
}

function handleNotify(state: CommState, events: EventRange, maybeMissing?: EventGenerator): CommState {
    // Only notify can set a new lastReceived
    // If notification indicates there are more events than we have, set to missed-messages
    // Can return missed-messages or connected, 
    // or the initial state (with revised missedMesages) if it's a replay
    const { lastReceived: priorLastReceived } = state;
    if (events.endRange > priorLastReceived) {
        // Connected!
        const lastReceived = events.endRange;
        return !!maybeMissing
            ? {
                type: 'missed-messages',
                lastReceived,
                missingEvents: maybeMissing
            }
            : {
                type: 'connected',
                lastReceived
            }
    } else {
        // We didn't fix the connection, but it may have been connected
        return editPreservingConnection(state, priorLastReceived, maybeMissing);
    }
}

function handleRecover(state: CommState, events: EventRange, maybeMissing?: EventGenerator): CommState {
    // Cannot reset lastReceived, or set connection status to connected
    // Can only modify missingEvents, or break connection if we're missing something
    const { lastReceived } = state;
    if (events.endRange > lastReceived) {
        return !!maybeMissing
            ? {
                type: 'broken-and-missed',
                lastReceived,
                missingEvents: maybeMissing
            }
            : {
                type: 'broken-connection',
                lastReceived
            }
    } else {
        // We didn't break the connection, but it may be broken
        return editPreservingConnection(state, lastReceived, maybeMissing);
    }
}

function editPreservingConnection(state: CommState, lastReceived: number, maybeMissing?: EventGenerator): CommState {
    return !!maybeMissing
        ? applyByConnected<CommState>(
            state,
            // Connected and missing
            {
                type: 'missed-messages',
                lastReceived,
                missingEvents: maybeMissing
            },
            // broken and missing
            {
                type: 'broken-and-missed',
                lastReceived,
                missingEvents: maybeMissing
            })
        : applyByConnected<CommState>(
            state,
            // Connected and not missing
            {
                type: 'connected',
                lastReceived
            },
            // broken and not missing
            {
                type: 'broken-connection',
                lastReceived
            });
}

function handleHeartbeatMiss(state: CommState): CommState {
    return state.type === 'connected' || state.type === 'broken-connection'
        ? { type: 'broken-connection', lastReceived: state.lastReceived }
        : { type: 'broken-and-missed', lastReceived: state.lastReceived, missingEvents: state.missingEvents }
}

function handleHeartbeat(state: CommState, eventsEndRange: number): CommState {
    const diffWithLast = eventsEndRange - state.lastReceived;
    const lastReceived = state.lastReceived;
    // Reconnects any state, but may have new missed range
    if (diffWithLast >= 0) {
        // Reconnects  
        if (diffWithLast === 0) {
            const lastReceived = state.lastReceived;
            return applyByMissed<CommState>(
                state,
                (missingEvents) => {
                    return {
                        type: 'missed-messages',
                        lastReceived,
                        missingEvents
                    }
                },
                () => {
                    return {
                        type: 'connected',
                        lastReceived
                    }
                });
            // Reconnects with new miss
        } else {
            const newMissed: EventRange = {
                endRange: eventsEndRange,
                count: diffWithLast
            };
            const missingEvents = applyByMissed<EventGenerator>(
                state,
                (priorMisses) => addRangeToGenerator(priorMisses, newMissed),
                () => createGenerator(newMissed)
            );
            return {
                type: 'missed-messages',
                lastReceived,
                missingEvents
            };
        }
        // Replayed heartbeat
    } else {
        return state;
    }
}

export function applyByConnected<T>(
    state: CommState,
    connected: T,
    disconnected: T
): T {
    switch (state.type) {
        case 'connected':
        case 'missed-messages':
            return connected;
        case 'broken-connection':
        case 'broken-and-missed':
            return disconnected
    }
}

export function applyByMissed<T>(
    state: CommState,
    applyMissed: (missed: EventGenerator) => T,
    applyNoMiss: () => T
): T {
    switch (state.type) {
        case 'connected':
        case 'broken-connection':
            return applyNoMiss();
        case 'missed-messages':
        case 'broken-and-missed':
            return applyMissed(state.missingEvents);
    }
}

function* createGenerator(create: EventRange): EventGenerator {
    yield create;
    return create.count;
}

function* addRangeToGenerator(existing: EventGenerator, add: EventRange): EventGenerator {
    let result = existing.next();
    while (!result.done) {
        yield result.value;
        result = existing.next();
    }
    yield add;
    return result.value + add.count;
}

type EmptyGenerator = {
    empty: true
}
type NonemptyGenerator = {
    empty: false,
    generator: EventGenerator
}
type GeneratorRemoveResult = EmptyGenerator | NonemptyGenerator;

function tryRemoveRangeFromGenerator(existing: EventGenerator, remove: EventRange): GeneratorRemoveResult {
    const newGenerator = removeRangeFromGenerator(existing, remove);
    const firstEntry = newGenerator.next();
    return !!firstEntry.done
        ? { empty: true }
        : { empty: false, generator: removeRangeFromGenerator(existing, remove) }
};

function* removeRangeFromGenerator(existing: EventGenerator, remove: EventRange): EventGenerator {
    let result = existing.next();
    // Copy input, make mutable while we carve away
    let toRemove: EventRange | undefined = { ...remove };
    // Keep track of removals for aggregate count
    let removalCount: number = 0;
    while (!result.done) {
        const range = result.value;
        if (typeof toRemove !== 'undefined') {
            const { removal, yieldedRange } = removeRangeForward(range, toRemove);
            switch (removal.type) {
                case 'none':
                    break;
                case 'partial':
                    const { newRemove, count } = removal;
                    removalCount = removalCount + count;
                    toRemove = newRemove;
                    break;
                case 'full':
                    removalCount = removalCount + removal.count;
                    break;
            }

            switch (yieldedRange.type) {
                case 'none':
                    break;
                case 'one':
                    yield yieldedRange.newRange;
                    break;
                case 'two':
                    const { firstRange, secondRange } = yieldedRange;
                    yield firstRange;
                    yield secondRange;
                    break;
            }
        } else {
            yield result.value
        }
        result = existing.next();
    }
    return result.value - removalCount;
}

// Types for removals
type RemovalWithCount = {
    count: number
}
type NoRemoval = {
    type: 'none'
}
type FullRemoval = RemovalWithCount & {
    type: 'full'
}
type PartialRemoval = RemovalWithCount & {
    type: 'partial',
    newRemove: EventRange
}
type Removal = NoRemoval | FullRemoval | PartialRemoval;

// Types for yielded ranges
type NoRange = {
    type: 'none'
}
type OneRange = {
    type: 'one'
    newRange: EventRange
}
type TwoRanges = {
    type: 'two',
    firstRange: EventRange,
    secondRange: EventRange
}
type YieldedRange = NoRange | OneRange | TwoRanges;

// Type for RemovalResult
type RemovalResult = {
    yieldedRange: YieldedRange,
    removal: Removal
}

function applyToRightLedge<T>(
    range: EventRange,
    remove: EventRange,
    applyZero: () => T,
    applyPositive: (value: number) => T,
    applyNegative: (absolute: number) => T
): T {
    const rightLedge = remove.endRange - range.endRange;
    if (rightLedge === 0) {
        return applyZero();
    } else if (rightLedge > 0) {
        return applyPositive(rightLedge);
    } else {
        return applyNegative(-rightLedge);
    }
}

function removeRangeForward(range: EventRange, remove: EventRange): RemovalResult {
    const startRange = range.endRange - range.count;
    const startRemove = remove.endRange - remove.count;
    // Check if it's an early or late miss
    if ((remove.endRange < startRange) || (startRemove > range.endRange)) {
        return {
            removal: {
                type: 'none'
            },
            yieldedRange: {
                type: 'one',
                newRange: range
            }
        }
        // Else there's an overlap. Start searching from the left
    } else {
        // Check if removal overlaps left of range
        if (startRemove <= startRange) {
            return applyToRightLedge<RemovalResult>(range, remove,
                // No leftover, complete removal
                () => {
                    return {
                        removal: {
                            type: 'full',
                            count: range.count //Use range b/c of left overhang
                        },
                        yieldedRange: {
                            type: 'none'
                        }
                    }
                },
                // Partial removal, no yield 
                (val) => {
                    return {
                        removal: {
                            type: 'partial',
                            count: range.count,
                            newRemove: {
                                count: val,
                                endRange: remove.endRange
                            }
                        },
                        yieldedRange: {
                            type: 'none'
                        }
                    }
                },
                // Full removal, yield single section
                (abs) => {
                    return {
                        removal: {
                            type: 'full',
                            count: remove.endRange - startRange
                        },
                        yieldedRange: {
                            type: 'one',
                            newRange: {
                                endRange: range.endRange,
                                count: abs
                            }
                        }
                    }
                });

            // If it doesn't, we know it's not a miss, but will have at least one newRange
        } else {
            const newRange: EventRange = {
                endRange: startRemove,
                count: startRemove - startRange
            }
            return applyToRightLedge<RemovalResult>(range, remove,
                // Full removal with single yielded range
                () => {
                    return {
                        removal: {
                            type: 'full',
                            count: remove.count //Use remove b/c no left overhang
                        },
                        yieldedRange: {
                            type: 'one',
                            newRange
                        }
                    }
                },
                // Partial removal, single yield 
                (val) => {
                    return {
                        removal: {
                            type: 'partial',
                            count: range.endRange - startRemove,
                            newRemove: {
                                count: val,
                                endRange: remove.endRange
                            }
                        },
                        yieldedRange: {
                            type: 'one',
                            newRange
                        }
                    }
                },
                // Full removal, yield two side sections
                (abs) => {
                    return {
                        removal: {
                            type: 'full',
                            count: remove.count
                        },
                        yieldedRange: {
                            type: 'two',
                            secondRange: {
                                endRange: range.endRange,
                                count: abs
                            },
                            firstRange: newRange
                        }
                    }
                });
        }
    }
}