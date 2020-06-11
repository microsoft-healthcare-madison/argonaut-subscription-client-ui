import React, {useState} from 'react';

import {
  HTMLSelect, Button, FormGroup, InputGroup,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import * as fhir from '../../models/fhir_r5';
import * as ValueSet from '../../models/fhir_VS';
import { SubscriptionHelper, SubscriptionReturn } from '../../util/SubscriptionHelper';

export interface SubscriptionS2Props {
  paneProps: ContentPaneProps,
  registerSubscription: ((subscription?: fhir.Subscription) => void),
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  selectedGroupId: string,
  topic: fhir.SubscriptionTopic|null,
  subscription: fhir.Subscription,
  endpoint: EndpointRegistration,
}

/** Component representing the Scenario 2 Subscription Card */
export default function SubscriptionS2(props: SubscriptionS2Props) {

  const info: DataCardInfo = {
    id: 's2_subscription',
    stepNumber: 4,
    heading: 'Request a Subscription on the FHIR Server',
    description: '',
    optional: false,
  };
  
  const [payloadType, setPayloadType] = useState<string>('id-only');
  const [headers, setHeaders] = useState<string>('');

  /** Get a FHIR Instant value from a JavaScript Date */
	function getInstantFromDate(date: Date) {
		return (JSON.stringify(date).replace(/['"]+/g, ''));
  }
  
  async function createSubscription() {
    props.updateStatus({...props.status, busy: true});

    // flag our parent to clear any old subscriptions
    props.registerSubscription();

    let endpointUrl: string = new URL(`Endpoints/${props.endpoint.uid!}`, props.paneProps.clientHostInfo.url).toString();

		// build our filter information
		let filter: fhir.SubscriptionFilterBy = {
			searchModifier: 'in',
			searchParamName: 'patient',
			value: `Group/${props.selectedGroupId}`
		}

		var expirationTime:Date = new Date();
		expirationTime.setHours(expirationTime.getHours() + 1);

    let topicResource: string = 'SubscriptionTopic';
    let topicUrl:string = props.topic 
      ? new URL(`${topicResource}/${props.topic!.id!}`, props.paneProps.fhirServerInfo.url).toString()
      : new URL(`${topicResource}/encounter-start`, props.paneProps.fhirServerInfo.url).toString();

		// build the subscription object
		let subscription: fhir.Subscription = {
      resourceType: 'Subscription',
      endpoint: endpointUrl,
      channelType: ValueSet.SubscriptionChannelType.rest_hook,
      heartbeatPeriod: 60,
      content: payloadType,
      contentType: 'application/fhir+json',
			filterBy: [filter],
			end: getInstantFromDate(expirationTime),
			topic: {reference:  topicUrl},
			reason: 'Client Testing',
			status: 'requested',
    }

    let header: string[] = (headers)
      ? headers.split(',')
      : [];
    
    if (header.length > 0) {
      subscription.header = header;
    }
    
    // try to create the subscription
    let subscriptionReturn:SubscriptionReturn = await SubscriptionHelper.CreateSubscription(
      props.paneProps.useBackportToR4,
      props.paneProps.fhirServerInfo,
      subscription,
      props.topic
    );

    // show the user our results
    props.setData([subscriptionReturn.data]);
      
    if (subscriptionReturn.subscription) {
      // register this subscription (updates status)
      props.registerSubscription(subscriptionReturn.subscription);
    } else {
      props.updateStatus({...props.status, busy: false});
    }
  }

  async function refreshSubscription(dataRowIndex: number) {
    props.updateStatus({...props.status, busy: true});

    let subscriptionReturn:SubscriptionReturn = await SubscriptionHelper.RefreshSubscription(
      props.paneProps.useBackportToR4,
      props.paneProps.fhirServerInfo,
      props.subscription);

    // update information of the create record in display
    let updated: SingleRequestData = {...props.data[0],
      responseData: subscriptionReturn.data.responseData,
      responseDataType: subscriptionReturn.data.requestDataType,
    };

    props.setData([updated]);
    props.updateStatus({...props.status, busy:false});
  }

  /** Process HTML events for the payload type select box */
	function handlePayloadTypeChange(event: React.FormEvent<HTMLSelectElement>) {
		setPayloadType(event.currentTarget.value);
  }

  /** Process HTML events for headers (update state for managed) */
  function handleHeadersChange(event: React.ChangeEvent<HTMLInputElement>) {
    setHeaders(event.target.value);
  }

  /** Return this component */
  return(
    <DataCard
      info={info}
      data={props.data}
      paneProps={props.paneProps}
      status={props.status}
      tabButtonText='Get Status'
      tabButtonHandler={refreshSubscription}
      >
      <FormGroup
        label='Subscription Notification Content'
        helperText='Amount of information included with subscription notifications'
        labelFor='payload-type'
        >
        <HTMLSelect
          id='payload-type'
          onChange={handlePayloadTypeChange}
          value={payloadType}
          >
          { Object.values(fhir.SubscriptionContentCodes).map((value) => (
            <option key={value}>{value}</option> 
              ))}
        </HTMLSelect>
      </FormGroup>
      <FormGroup
        label='Subscription Notification Headers'
        helperText='Comman (,) separated list of headers to include with notifications - leave blank if testing against the default client'
        labelFor='subscription-headers'
        >
        <InputGroup 
          id='subscription-headers'
          value={headers}
          onChange={handleHeadersChange}
          />
      </FormGroup>
      <Button
        disabled={(!props.status.available) || (props.status.busy)}
        onClick={createSubscription}
        style={{margin: 5}}
        >
        Create Subscription
      </Button>
    </DataCard>
  );
}