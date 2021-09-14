import React from 'react';
import { ReactNode } from 'react';

import { CommState, applyByConnected, applyByMissed } from '../../models/CommunicationStatus';

export default function CommStatusDisplay({ commState }: { commState: CommState }) {
    const { lastReceived, type } = commState;
    return <div>
        <p>
            {`Status ${type}. Last received event ${lastReceived}`}
        </p>
        <p>
            {applyByConnected(
                commState,
                "Connected!",
                "Not connected..."
            )}
        </p>
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