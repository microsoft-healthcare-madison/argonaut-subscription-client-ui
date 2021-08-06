import React, {useState} from 'react';

import {
  HTMLSelect, Button, FormGroup, InputGroup,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import * as fhir4 from '../../local_dts/fhir4';
import * as fhir5 from '../../local_dts/fhir5';
import * as fhirCommon from '../../models/fhirCommon';
import { SubscriptionReturn, SubscriptionHelper } from '../../util/SubscriptionHelper';

export interface SubscriptionS1Props {
  paneProps: ContentPaneProps,
  registerSubscription: ((subscription?: fhir5.Subscription) => void),
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  selectedPatientId: string,
  topic: fhir4.SubscriptionTopic|fhir5.SubscriptionTopic|null,
  subscription: fhir5.Subscription,
  endpoint: EndpointRegistration,
}

/** Component representing the Scenario 1 Subscription Card */
export default function SubscriptionS1(props: SubscriptionS1Props) {

  const info: DataCardInfo = {
    id: 's1_subscription',
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
		let filter: fhir5.SubscriptionFilterBy = {
			searchModifier: '=',
			searchParamName: 'patient',
			value: `Patient/${props.selectedPatientId}`	    //`Patient/${patientFilter},Patient/K123`
		}

		var expirationTime:Date = new Date();
		expirationTime.setHours(expirationTime.getHours() + 1);

    let baseUrl:string = props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.url : props.paneProps.fhirServerInfoR5.url;

    let topicResource: string = 'SubscriptionTopic';
    let topicUrl:string = props.topic 
      ? new URL(`${topicResource}/${props.topic!.id!}`, baseUrl).toString()
      : new URL(`${topicResource}/encounter-start`, baseUrl).toString();

		// build the subscription object
		let subscription: fhir5.Subscription = {
      resourceType: 'Subscription',
      endpoint: endpointUrl,
      channelType: fhirCommon.SubscriptionChannelType.rest_hook,
      heartbeatPeriod: 60,
      content: payloadType as fhirCommon.SubscriptionContentCodes,
      contentType: 'application/fhir+json',
			filterBy: [filter],
			end: getInstantFromDate(expirationTime),
			topic: { reference: topicUrl },
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
      props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4 : props.paneProps.fhirServerInfoR5,
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
      props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4 : props.paneProps.fhirServerInfoR5,
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
          { Object.values(fhirCommon.SubscriptionContentCodes).map((value) => (
            <option key={value}>{value}</option> 
              ))}
        </HTMLSelect>
      </FormGroup>
      <FormGroup
        label='Subscription Notification Headers'
        helperText='Comma (,) separated list of headers to include with notifications - leave blank if testing against the default client'
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