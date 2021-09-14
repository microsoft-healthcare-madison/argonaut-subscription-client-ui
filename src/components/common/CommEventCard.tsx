import React from 'react';

import { CommEvent } from '../../models/CommunicationStatus';

export default function CommStatusDisplay({ event }: { event: CommEvent }) {
    const typeText = "Event to send: " + event.type + '.';
    switch (event.type) {
        case 'heartbeat-miss':
        case 'clear':
            return <p>{typeText}</p>
        case 'heartbeat':
            return <p>{typeText + ` eventsSinceSubscriptionStart will be ${event.eventsSinceSubscriptionStart}`}</p>
        case 'notify':
        case 'recover':
            return <p>{typeText + ` eventsSinceSubscriptionStart will be ${event.eventsSinceSubscriptionStart}` + ". Events to include: " + JSON.stringify(event.events, null, 2)}</p>
    }
}