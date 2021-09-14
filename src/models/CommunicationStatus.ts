import { EventRange, EventList, removeRangeFromList, getStart } from './EventRange';

// Event Types
type BaseEvent<T extends string> = {
    type: T,
    eventsSinceSubscriptionStart: number
}
type EventWithEvents<T extends string> = BaseEvent<T> & {
    events: EventRange
};
type RecoverEvent = EventWithEvents<'recover'>;
type NotifyEvent = EventWithEvents<'notify'>;
type HeartBeatEvent = BaseEvent<'heartbeat'>;
type HeartBeatMissEvent = { type: 'heartbeat-miss' }
type ClearState = { type: 'clear' };
export type CommEvent = RecoverEvent | NotifyEvent | HeartBeatEvent | HeartBeatMissEvent | ClearState;

// State Types
type BaseState<T extends string> = {
    type: T,
    lastReceived: number,
    receivedEvents?: EventList
};

type MissingEventsState<T extends string> = BaseState<T> & {
    missingEvents: EventList
}
type Connected = BaseState<'connected'>;
type MissedMessages = MissingEventsState<'missed-messages'>;
type BrokenConnection = BaseState<'broken-connection'>;
type BrokenAndMissed = MissingEventsState<'broken-and-missed'>;
export type CommState = Connected | MissedMessages | BrokenConnection | BrokenAndMissed;

export function reducer(state: CommState, action: CommEvent): CommState {
    function returnState(
        isConnected: boolean,
        lastReceived: number,
        missingEvents?: EventList,
        receivedEvents?: EventList
    ): CommState {
        return isConnected
            ? !!missingEvents
                ? { type: 'missed-messages', missingEvents, receivedEvents, lastReceived }
                : { type: 'connected', receivedEvents, lastReceived }
            : !!missingEvents
                ? { type: 'broken-and-missed', lastReceived, missingEvents, receivedEvents }
                : { type: 'broken-connection', lastReceived, receivedEvents }
    };
    if (action.type === 'clear') {
        return { type: 'connected', lastReceived: 0 }
    } else if (action.type === 'heartbeat-miss') {
        return applyByMissed<CommState>(state, (missingEvents) => {
            return {
                type: 'broken-and-missed',
                lastReceived: state.lastReceived,
                missingEvents
            }
        }, () => {
            return {
                type: 'broken-connection',
                lastReceived: state.lastReceived
            }
        });
    } else {
        const lastKnown = applyByMissed(state, (missingEvents) => {
            return checkLastKnown(missingEvents, state.lastReceived)
        }, () => state.lastReceived);
        const sinceStartToKnown = action.eventsSinceSubscriptionStart - lastKnown;
        const maybeMissingEvents = checkNewMissed(state.lastReceived,
            action.eventsSinceSubscriptionStart,
            applyByMissed(state, missed => missed, () => undefined));
        if (sinceStartToKnown < 0) {
            // Get the new missing (and received) events 
            const { missingEvents, receivedEvents } = addEventsSimple(action, maybeMissingEvents);
            return returnState(
                applyByConnected(state, true, false),
                getNewLastReceived(action, state),
                missingEvents,
                receivedEvents
            )
        } else if (sinceStartToKnown === 0) {
            // Get the new missing (and received) events
            const { missingEvents, receivedEvents } = addEventsSimple(action, maybeMissingEvents);
            return returnState(
                action.type !== 'recover',
                getNewLastReceived(action, state),
                missingEvents,
                receivedEvents
            )
        } else {
            // TODO: What happens if there is a gap in what's returned?
            // Ex: sinceStart is 38, but we're given just 37 in body the below breaks
            // First: Need to calculate new missing events
            const maybeNewMissing = checkNewMissed(
                state.lastReceived, 
                action.eventsSinceSubscriptionStart,
                maybeMissingEvents);
            const { missingEvents, receivedEvents } = addEventsSimple(action, maybeNewMissing);
            return returnState(
                action.type !== 'recover',
                getNewLastReceived(action, state),
                missingEvents,
                receivedEvents
            )
        }
    }
}

const getNewLastReceived = (action: HeartBeatEvent | NotifyEvent | RecoverEvent, state: CommState): number => {
    switch (action.type) {
        case 'heartbeat':
        case 'recover':
            return state.lastReceived;
        case 'notify':
            return Math.max(action.events.endRange, state.lastReceived);
    }
}

const addEventsSimple = (action: HeartBeatEvent | NotifyEvent | RecoverEvent, priorMissed?: EventList): { receivedEvents?: EventList, missingEvents?: EventList } => {
    switch (action.type) {
        case 'heartbeat':
            return { missingEvents: priorMissed }
        case 'notify':
        case 'recover':
            if (!!priorMissed) {
                const { removed, result } = removeRangeFromList(priorMissed, action.events)
                return {
                    missingEvents: result,
                    receivedEvents: removed
                }
            } else {
                return {}
            }
    }
}

/**
 * This functions assumes the following:
 * - lastReceived does not overlap any event in priorMissingEvents
 * - eventsSinceSubscriptionStart is greater than the lastKnown event
 * @param lastReceived 
 * @param eventsSinceSubscriptionStart 
 * @param priorMissingEvents 
 * @returns 
 */
function checkNewMissed
    (lastReceived: number, eventsSinceSubscriptionStart: number, priorMissingEvents?: EventList):
    EventList | undefined {
    if (!!priorMissingEvents) {
        const checkArray = (array: EventList) => array.length === 0
            ? undefined
            : array;
        // Take missingEvents into account. Need to check which property knows of a greater event
        const missingCopy = priorMissingEvents.slice();
        const lastMissedEntry = missingCopy[missingCopy.length - 1];
        const lastMissed = lastMissedEntry.endRange;
        // Assume lastMissed !== lastReceived. We shouldn't generate that
        if (lastMissed > lastReceived) {
            // Need to append to lastMissedEntry
            const newMissing: EventRange = {
                endRange: eventsSinceSubscriptionStart,
                count: eventsSinceSubscriptionStart - getStart(lastMissedEntry)
            };
            missingCopy.pop();
            missingCopy.push(newMissing);
            return checkArray(missingCopy)
        } else {
            // Need to append a new entry to missingCopy
            const newMissing = {
                endRange: eventsSinceSubscriptionStart,
                count: eventsSinceSubscriptionStart - lastReceived
            }
            missingCopy.push(newMissing);
            return checkArray(missingCopy)
        }
    } else {
        // Just check lastReceived vs sinceStart...
        const sinceStartToReceived = eventsSinceSubscriptionStart - lastReceived;
        return sinceStartToReceived > 0
            ? [{ endRange: eventsSinceSubscriptionStart, count: sinceStartToReceived }]
            : undefined;
    }
}

function checkLastKnown(missingEvents: EventList, lastReceived: number): number {
    const missingLength = missingEvents.length;
    return missingLength < 1
        ? lastReceived
        : Math.max(missingEvents[missingLength - 1].endRange, lastReceived);
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
    applyMissed: (missed: EventList) => T,
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