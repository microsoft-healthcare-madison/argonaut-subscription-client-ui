import React, {useState} from 'react';

import {
  HTMLSelect, Button, FormGroup,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import { ApiHelper, ApiResponse } from '../../util/ApiHelper';
import * as fhir from '../../models/fhir_r4_selected';

export interface SubscriptionS1Props {
  paneProps: ContentPaneProps,
  registerSubscription: ((subscription?: fhir.Subscription) => void),
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  selectedPatientId: string,
  topic: fhir.Topic|null,
  subscription: fhir.Subscription,
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

  /** Get a FHIR Instant value from a JavaScript Date */
	function getInstantFromDate(date: Date) {
		return (JSON.stringify(date).replace(/['"]+/g, ''));
  }
  
  async function createSubscription() {
    props.updateStatus({...props.status, busy: true});

    // **** flag our parent to clear any old subscriptions ****

    props.registerSubscription();

		// **** build the url for our call ***

    let url: string = new URL('Subscription', props.paneProps.fhirServerInfo.url).toString();
    let endpointUrl: string = new URL(`Endpoints/${props.endpoint.uid!}`, props.paneProps.clientHostInfo.url).toString();

		// **** build our subscription channel information ****

		let channel: fhir.SubscriptionChannel = {
			endpoint: endpointUrl,
			header: [],
			heartbeatPeriod: 60,
			payload: {content: payloadType, contentType: 'application/fhir+json'},
			type: {coding: [fhir.SubscriptionChannelTypeCodes.rest_hook], text: 'REST Hook'},
		}

		// **** build our filter information ****

		let filter: fhir.SubscriptionFilterBy = {
			matchType: '=',
			name: 'patient',
			value: `Patient/${props.selectedPatientId}`	    //`Patient/${patientFilter},Patient/K123`
		}

		var expirationTime:Date = new Date();
		expirationTime.setHours(expirationTime.getHours() + 1);

    let topicUrl:string = props.topic 
      ? new URL(`Topic/${props.topic!.id!}`, props.paneProps.fhirServerInfo.url).toString()
      : new URL('Topic/admission', props.paneProps.fhirServerInfo.url).toString();

		// **** build the subscription object ****

		let subscription: fhir.Subscription = {
			resourceType: 'Subscription',
			channel: channel,
			filterBy: [filter],
			end: getInstantFromDate(expirationTime),
			topic: {reference:  topicUrl},
			reason: 'Client Testing',
			status: 'requested',
    }
    
    // **** try to create the subscription ****

    try {
      let response: ApiResponse<fhir.Subscription> = await ApiHelper.apiPostFhir(
        url,
        subscription,
        props.paneProps.fhirServerInfo.authHeaderContent,
        props.paneProps.fhirServerInfo.preferHeaderContent
        );
      
      if (response.value) {
        // **** show the client subscription information ****

        let updated: SingleRequestData = {
          name: 'Create Subscription',
          id: 'create_subscription',
          requestUrl: url, 
          requestData: JSON.stringify(subscription, null, 2),
          requestDataType: RenderDataAsTypes.FHIR,
          responseData: response.value ? JSON.stringify(response.value, null, 2) : response.body,
          responseDataType: response.value ? RenderDataAsTypes.FHIR : RenderDataAsTypes.Text,
          outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
          };

        props.setData([updated]);
        
        // **** register this subscription (updates status) ****

        props.registerSubscription(response.value!);

        // **** done ****
        return;
      }

      // **** show the client subscription information ****

      let updated: SingleRequestData = {
        name: 'Create Subscription',
        id: 'create_subscription',
        requestUrl: url, 
        requestData: JSON.stringify(subscription, null, 2),
        requestDataType: RenderDataAsTypes.FHIR,
        responseData: `Request for Subscription (${url}) failed:\n` +
          `${response.statusCode} - "${response.statusText}"\n` +
          `${response.body}`,
        responseDataType: RenderDataAsTypes.Error,
        outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
        };

      props.setData([updated]);
      props.updateStatus({...props.status, busy: false});

      // **** done ****

      return;
    } catch (err) {
      // **** show the client subscription information ****

      let updated: SingleRequestData = {
        name: 'Create Subscription',
        id: 'create_subscription',
        requestUrl: url, 
        responseData: `Request for Subscription (${url}) failed:\n${err}`,
        responseDataType: RenderDataAsTypes.Error
        };

      props.setData([updated]);
      props.updateStatus({...props.status, busy: false});

      // **** done ****

      return;
    }
  }

  async function refreshSubscription(dataRowIndex: number) {
    props.updateStatus({...props.status, busy: true});

		// **** build the url for our call ***

    let url: string = new URL(`Subscription/${props.subscription.id!}`, props.paneProps.fhirServerInfo.url).toString();

    // **** ask for this subscription to be created ****
    
    try {
      let response: ApiResponse<fhir.Subscription> = await ApiHelper.apiGet<fhir.Subscription>(
        url,
        props.paneProps.fhirServerInfo.authHeaderContent,
        );
      
      if (!response.value) {
        // **** show the client error information ****

        let updated: SingleRequestData = {...props.data[0],
          requestUrl: url, 
          responseData: `Request for Subscription (${url}) failed:\n` +
            `${response.statusCode} - "${response.statusText}"\n` +
            `${response.body}`,
          responseDataType: RenderDataAsTypes.Error,
          };

        props.setData([updated]);
        props.updateStatus({...props.status, busy: false});

        return;
      }

      // **** show the client subscription information ****

      let updated: SingleRequestData = {...props.data[0],
        responseData: JSON.stringify(response.value, null, 2),
        responseDataType: RenderDataAsTypes.FHIR,
        };

      props.setData([updated]);
      props.updateStatus({...props.status, busy:false});

      // **** done ****

      return;
    } catch (err) {
      // **** show the client subscription information ****

      let updated: SingleRequestData = {
        name: 'Create Subscription',
        id: 'create_subscription',
        requestUrl: url, 
        responseData: `Request for Subscription (${url}) failed:\n${err}`,
        responseDataType: RenderDataAsTypes.Error
        };

      props.setData([updated]);
      props.updateStatus({...props.status, busy: false});
    }
  }

  /** Process HTML events for the payload type select box */
	function handlePayloadTypeChange(event: React.FormEvent<HTMLSelectElement>) {
		setPayloadType(event.currentTarget.value);
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
        label='Subscription Notification Payload Type'
        helperText='Amount of information included with subscription notifications'
        labelFor='payload-type'
        >
        <HTMLSelect
          id='payload-type'
          onChange={handlePayloadTypeChange}
          value={payloadType}
          >
          { Object.values(fhir.SubscriptionChannelPayloadContentCodes).map((value) => (
            <option key={value}>{value}</option> 
              ))}
        </HTMLSelect>
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