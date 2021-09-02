import React, { useState } from 'react';

import {
  Tabs, Tab, TabId,
  Button, Card, H6, HTMLSelect, InputGroup, Spinner, FormGroup, Switch,
} from '@blueprintjs/core';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
// import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { CommEvent } from '../../models/CommunicationStatus';
import CommStatusCard from '../common/CommStatusCard';

export interface CommStatusPgProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus
  //   data: SingleRequestData[]
}

/** Component representing the Playground CommStatus card */
export default function CommStatusPg(props: CommStatusPgProps) {

  const info: DataCardInfo = {
    id: 'pg_commStatus',
    heading: 'Manually trigger communication events',
    description: '',
    optional: true,
  };

  type TabTypes = 'heartbeat' | 'heartbeat-miss' | '$events' | 'notification';
  const [selectedTabId, setSelectedTabId] = useState<TabTypes>('notification');
  const [commEvents, setCommEvents] = useState<CommEvent[]>([]);
  const [nextEndRange, setNextEndRange] = useState<number>(0);
  const [nextCount, setNextCount] = useState<number>(0);

  /** Process HTML events for the patient id (update state for managed) */
  function handleNextEndRangeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNextEndRange(Number.parseInt(event.target.value) || 0);
  }

  /** Process HTML events for the patient id (update state for managed) */
  function handleNextCountChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNextCount(Number.parseInt(event.target.value) || 0);
  }

  /** Function to handle tab selection changes */
  function handleTabChange(navbarTabId: TabId | TabTypes) {
    switch (navbarTabId) {
      case 'heartbeat':
      case 'heartbeat-miss':
      case '$events':
      case 'notification':
        setSelectedTabId(navbarTabId);
        break;
      default:
        window.alert('Invalid tab :' + navbarTabId);
        break;
    }
  }

  // return card with search and create options
  return (
    <DataCard
      info={info}
      data={[]}
      paneProps={props.paneProps}
      status={props.status}
    >
      <Tabs
        animate={true}
        id='tabsPlaygComms'
        vertical={false}
        selectedTabId={selectedTabId}
        onChange={handleTabChange}
      >
        <Tab
          id='heartbeat'
          title='heartbeat'
          panel={
            <Card>
              <FormGroup
                label='heartbeat data'
                helperText='The eventsSinceSubscriptionStart value for this heartbeat'
                labelFor='heartbeat-endRange'
              >
                <InputGroup
                  id='heartbeat-endRange'
                  onChange={handleNextEndRangeChange}
                />
              </FormGroup>
            </Card>
          }
        />
        <Tab
          id='notification'
          title='notification'
          panel={
            <Card>
              <FormGroup
                label='notification latest event'
                helperText='The eventsSinceSubscriptionStart value for this notification'
                labelFor='notification-endRange'
              >
                <InputGroup
                  id='notification-endRange'
                  onChange={handleNextEndRangeChange}
                />
              </FormGroup>
              <FormGroup
                label='notification event count'
                helperText='The eventsInNotification value for this notification'
                labelFor='notification-count'
              >
                <InputGroup
                  id='notification-count'
                  onChange={handleNextCountChange}
                />
              </FormGroup>
            </Card>
          }
        />
        <Tab
          id='$events'
          title='$events'
          panel={
            <Card>
            <FormGroup
              label='$events latest event'
              helperText='The eventsSinceSubscriptionStart value for this $events call'
              labelFor='$events-endRange'
            >
              <InputGroup
                id='$events-endRange'
                onChange={handleNextEndRangeChange}
              />
            </FormGroup>
            <FormGroup
              label='$events event count'
              helperText='The eventsInNotification value for this $events call'
              labelFor='$events-count'
            >
              <InputGroup
                id='$events-count'
                onChange={handleNextCountChange}
              />
            </FormGroup>
          </Card>
          }
        />
        <Tab
          id='heartbeat-miss'
          title='heartbeat missed'
          panel={
            <Card>
              <strong>No input needed. Click submit to send</strong>
            </Card>
          }
        />
      </Tabs>
      <Button
        onClick={() => {
          const nextEvent = ((): CommEvent => {
            switch (selectedTabId) {
              case 'heartbeat':
                return {
                  type: 'heartbeat',
                  eventsEndRange: nextEndRange
                }
              case 'heartbeat-miss':
                return {
                  type: 'heartbeat-miss'
                }
              case '$events':
                return {
                  type: 'recover',
                  events: {
                    count: nextCount,
                    endRange: nextEndRange
                  }
                }
              case 'notification':
                return {
                  type: 'recover',
                  events: {
                    count: nextCount,
                    endRange: nextEndRange
                  }
                }
            }
          })()
          setCommEvents(commEvents.concat(nextEvent));
        }}
        style={{ margin: 5 }}
      >
        Issue Event
      </Button>
      <Button onClick={() => {setCommEvents([])}}>Reset status</Button>
      <CommStatusCard commEvents={commEvents} />
    </DataCard>
  );
}