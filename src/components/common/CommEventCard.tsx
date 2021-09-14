import React from 'react';

import { CommEvent } from '../../models/CommunicationStatus';

export default function CommStatusDisplay({ event }: { event: CommEvent }) {
    const typeText = "Received type: " + event.type + '\n';
    switch (event.type) {
        case 'heartbeat':
            return <p>{typeText + `Indicated event ${event.eventsSinceSubscriptionStart} existed`}</p>
        case 'heartbeat-miss':
        case 'clear':
            return <p>{typeText}</p>
        case 'notify':
        case 'recover':
            return <p>{typeText + ". Events: " + JSON.stringify(event.events, null, 2)}</p>
    }
}