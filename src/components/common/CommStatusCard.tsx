import React from 'react';
import { ReactNode } from 'react';

import { CommState, applyByConnected, applyByMissed, CommEvent, reducer, EventRange } from '../../models/CommunicationStatus';

export default function CommStatusDisplay({ commEvents }: { commEvents: CommEvent[] }) {

    let status: CommState = { type: 'connected', lastReceived: 0 };
    let error: { error: false } | { error: true, index: number, message: string };
    error = { error: false };

    commEvents.forEach((event, index) => {
        if (!error.error) {
            const result = reducer(status, event);
            if (result.error) {
                error = { error: true, index, message: result.message }
            } else {
                status = result.commState
            }
        }
    });

    if (!error.error) {

        const eventNodes: ReactNode[] = commEvents.map((event, index) => {
            const typeText = "Received type: " + event.type + '\n';
            switch (event.type) {
                case 'heartbeat':
                    return <p key={index}>{typeText + `Indicated event ${event.eventsEndRange} existed`}</p>
                case 'heartbeat-miss':
                    return <p key={index}>{typeText}</p>
                case 'notify':
                case 'recover':
                    return <p key={index}>{typeText + ". Events: " + JSON.stringify(event.events, null, 2)}</p>
            }
        });
        eventNodes.unshift(<p>{"List of received events"}</p>)

        const { lastReceived, type } = status;
        return <div>
            <p>
                {`Status ${type}. Last received event ${lastReceived}`}
            </p>
            <p>
                {applyByConnected(
                    status,
                    "Connected!",
                    "Not connected..."
                )}
            </p>
            <p>
                {applyByMissed(
                    status,
                    (missingEvents) => {
                        const ranges: EventRange[] = Array.from(missingEvents);
                        const nodes: ReactNode[] = ranges.map(range => {
                            return <pre key={range.endRange}>{JSON.stringify(range, null, 2)}</pre>
                        });
                        nodes.unshift(<p>{"Missing events"}</p>)
                        return <div>{nodes}</div>
                    },
                    () => <p>{"No missing events!"}</p>)}
            </p>
            <p>
                <div>{eventNodes}</div>
            </p>
        </div>
    }
    return <div>{"Encounter error: " + JSON.stringify(error)}</div>

}