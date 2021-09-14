import React from 'react';
import { ReactNode } from 'react';

import { CommState, applyByConnected, applyByMissed } from '../../models/CommunicationStatus';

export default function CommStatusDisplay({ commState }: { commState: CommState }) {
    const { lastReceived, type, receivedEvents } = commState;
    return <div>
        <h3>Events most recently received</h3>
        <p>
            {!!receivedEvents
                ? <pre >{JSON.stringify(commState.receivedEvents, null, 2)}</pre>
                : <p>Received no events in last event</p>}
        </p>
        <h3>Last Received Event ($events counts)</h3>
        <p>
            {`Status ${type}. Last received event ${lastReceived}`}
        </p>
        <h3>Current connection status</h3>
        <p>
            {applyByConnected(
                commState,
                "Connected!",
                "Not connected..."
            )}
        </p>
        <h3>Missing Events (if any)</h3>
        <p>
            {applyByMissed(
                commState,
                (missingEvents) => {
                    const nodes: ReactNode[] = missingEvents.map(range => {
                        return <pre key={range.endRange}>{JSON.stringify(range, null, 2)}</pre>
                    });
                    nodes.unshift(<p>{"Missing events"}</p>)
                    return <div>{nodes}</div>
                },
                () => <p>{"No missing events!"}</p>)}
        </p>
    </div>
}