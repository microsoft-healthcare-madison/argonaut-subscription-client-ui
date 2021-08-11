import React, {useState} from 'react';

import {
  HTMLSelect, Button, FormGroup,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { ApiHelper, ApiResponse } from '../../util/ApiHelper';
import * as fhir from '../../local_dts/fhir5';
import * as fhirCommon from '../../models/fhirCommon';
import { useEffect } from 'react';

export interface OperationEventsProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  subscription?: fhir5.Subscription | null,
  subscriptions?: fhir5.Subscription[] | null,
}

/** Component representing the Operation Events Card */
export default function OperationEventsCard(props: OperationEventsProps) {

  const info: DataCardInfo = {
    id: 'operation_events',
    heading: 'Query Subscription Events',
    description: '',
    optional: true,
  };
  
  const [eventNumberLow, setEventNumberLow] = useState<number>(0);
  const [eventNumberHigh, setEventNumberHigh] = useState<number>(0);
  const [contentHint, setContentHint] = useState<string>('full-resource');

  const [subscriptionId, setSubscriptionId] = useState<string>('');

  useEffect(() => {
    if ((subscriptionId === '') && 
        (props.subscriptions !== null) && 
        (props.subscriptions !== undefined) &&
        (props.subscriptions!.length > 0)) {
      setSubscriptionId(props.subscriptions![0].id!);
    }

  }, [props.subscriptions, subscriptionId, setSubscriptionId])

  async function queryEvents() {
    let id:string;

    if ((props.subscription !== null) && 
        (props.subscription !== undefined)) {
      id = props.subscription!.id!;
    } else {
      id = subscriptionId;
    }

    if (id === '') {
      return;
    }

    props.updateStatus({...props.status, busy: true});

		// build the url for our call
    let url: string = new URL(
      `Subscription/${id}/$events` +
        `?eventsSinceNumber=${eventNumberLow}` +
        `&eventsUntilNumber=${eventNumberHigh}` +
        `&content=${contentHint}`,
      props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.url : props.paneProps.fhirServerInfoR5.url).toString();

    // ask for this encounter to be created
    try {
      let response:ApiResponse<fhir.Bundle> = await ApiHelper.apiGetFhir<fhir.Bundle>(
        url,
        props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.authHeaderContent : props.paneProps.fhirServerInfoR5.authHeaderContent);

      if (!response.value) {
        // show the client subscription information
        let updated: SingleRequestData = {
          name: 'Operation $events',
          id: 'operation_events',
          requestUrl: url, 
          responseData: `Operation $events (${url}) failed:\n` +
            `${response.statusCode} - "${response.statusText}"\n` +
            `${response.body}`,
          responseDataType: RenderDataAsTypes.Error,
          outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
          };

        props.setData([updated]);
        props.updateStatus({...props.status, busy: false});
        return;
      }

      // show the client encounter information
      let updated: SingleRequestData = {
        name: 'Operation $events',
        id: 'operation_events',
        requestUrl: url, 
        responseData: JSON.stringify(response.value, null, 2),
        responseDataType: RenderDataAsTypes.FHIR,
        outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
        };

      props.setData([updated]);
      props.updateStatus({...props.status, busy: false});
    } catch (err) {
      // show the client subscription information
      let updated: SingleRequestData = {
        name: 'Operation $events',
        id: 'operation_events',
        requestUrl: url, 
        responseData: `Operation $events (${url}) failed:\n${err}`,
        responseDataType: RenderDataAsTypes.Error
        };

      props.setData([updated]);
      props.updateStatus({...props.status, busy: false});
    }
  }

  /** Process HTML events for the payload type select box */
	function handleContentHintChange(event: React.FormEvent<HTMLSelectElement>) {
		setContentHint(event.currentTarget.value);
  }

  function handleSubscriptionSelectorChange(event: React.FormEvent<HTMLSelectElement>) {
    setSubscriptionId(event.currentTarget.value);
  }

  // return the standard component
  return(
    <DataCard
      info={info}
      data={props.data}
      paneProps={props.paneProps}
      status={props.status}
      >
      <FormGroup
        label='Content Hint'
        helperText='Content (type) hint for query'
        labelFor='content-hint'
        >
        <HTMLSelect
          id='content-hint'
          onChange={handleContentHintChange}
          value={contentHint}
          >
          { Object.values(fhirCommon.SubscriptionContentCodes).map((value) => (
            <option key={value} value={value}>{value}</option>
              ))}
        </HTMLSelect>
      </FormGroup>
      { ((props.subscriptions !== undefined) && (props.subscriptions!.length > 0)) &&
        <FormGroup
          label='Subscription'
          helperText='Subscription to query'
          labelFor='subscription-selector'
          >
          <HTMLSelect
            id='subscription-selector'
            onChange={handleSubscriptionSelectorChange}
            value={subscriptionId}
            >
            {Object.values(props.subscriptions!).map((value, index) => (
              <option key={value.id!} value={value.id!}>Subscription #{index}: {value.id!}</option>
              ))}
          </HTMLSelect>
        </FormGroup>
      }
      <Button
        disabled={(!props.status.available) || (props.status.busy)}
        onClick={queryEvents}
        style={{margin: 5}}
        >
        Query Events
      </Button>
    </DataCard>
  );
}