import React, {useState} from 'react';

import {
  HTMLSelect, Button, FormGroup, InputGroup, Spinner,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../models/ContentPaneProps';
import { DataCardInfo } from '../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../models/RequestData';
import DataCard from './DataCard';
import { DataCardStatus } from '../models/DataCardStatus';
import { EndpointRegistration } from '../models/EndpointRegistration';
import { ApiHelper } from '../util/ApiHelper';
import * as fhir from '../models/fhir_r4_selected';

export interface S1_SubscriptionProps {
  paneProps: ContentPaneProps,
  registerSubscription: ((subscription: fhir.Subscription) => void),
  status: DataCardStatus,
  updateStatus: ((step: number, status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((step: number, data: SingleRequestData[]) => void),
  selectedPatientId: string,
  endpoint: EndpointRegistration,
}

/** Component representing the Scenario 1 Subscription Card */
export default function S1_Subscription(props: S1_SubscriptionProps) {

  const info: DataCardInfo = {
    id: 's1_subscription',
    stepNumber: 4,
    heading: 'Request a Subscription on the FHIR Server',
    description: '',
    optional: false,
  };
  
  const [payloadType, setPayloadType] = useState<string>('id-only');
  const [headers, setHeaders] = useState<string>('Authorization: Bearer secret-token-abc-123');

  /** Get a FHIR Instant value from a JavaScript Date */
	function getInstantFromDate(date: Date) {
		return (JSON.stringify(date).replace(/['"]+/g, ''));
  }
  
  function createSubscription() {
    props.updateStatus(info.stepNumber!, {...props.status, busy: true});

		// **** build the url for our call ***

    let url: string = new URL('Subscription/', props.paneProps.fhirServerInfo.url).toString();
    let endpointUrl: string = new URL(`Endpoints/${props.endpoint.uid!}`, props.paneProps.clientHostInfo.url).toString();

    let header: string[] = (headers)
      ? headers.split(',')
      : [];

		// **** build our subscription channel information ****

		let channel: fhir.SubscriptionChannel = {
			endpoint: endpointUrl,
			header: header,
			heartbeatPeriod: 60,
			payload: {content: payloadType, contentType: 'application/fhir+json'},
			type: { text: 'rest-hook'},
		}

		// **** build our filter information ****

		let filter: fhir.SubscriptionFilterBy = {
			matchType: '=',
			name: 'patient',
			value: `Patient/${props.selectedPatientId}`	    //`Patient/${patientFilter},Patient/K123`
		}

		var expirationTime:Date = new Date();
		expirationTime.setHours(expirationTime.getHours() + 1);

		// **** build the subscription object ****

		let subscription: fhir.Subscription = {
			resourceType: 'Subscription',
			channel: channel,
			filterBy: [filter],
			end: getInstantFromDate(expirationTime),
			topic: {reference:  new URL('Topic/admission', props.paneProps.fhirServerInfo.url).toString()},
			reason: 'Client Testing',
			status: 'requested',
		}

		// **** ask for this subscription to be created ****

		ApiHelper.apiPost<fhir.Subscription>(url, JSON.stringify(subscription))
			.then((value: fhir.Subscription) => {
				// **** show the client subscription information ****

        let updated: SingleRequestData = {
          name: 'Create Subscription',
          id: 'create_subscription',
          requestUrl: url, 
          responseData: JSON.stringify(value, null, 2),
          responseDataType: RenderDataAsTypes.FHIR,
          };

        props.setData(info.stepNumber!, [updated]);

        // **** register this subscription (updates status) ****

        props.registerSubscription(value);
			})
			.catch((reason: any) => {
        // **** show the client subscription information ****

        let updated: SingleRequestData = {
          name: 'Create Subscription',
          id: 'create_subscription',
          requestUrl: url, 
          responseData: `Request for Subscription (${url}) failed:\n${reason}`,
          responseDataType: RenderDataAsTypes.Error
          };

        props.setData(info.stepNumber!, [updated]);
        props.updateStatus(info.stepNumber!, {...props.status, busy: false});
			});
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
      <FormGroup
        label='Subscription Headers'
        helperText='Comma (,) separated list of headers to include with notifications (per channel requirements)'
        labelFor='subscription-headers'
        >
        <InputGroup
          id='subscription-headers'
          value={headers}
          onChange={handleHeadersChange}
          />
      </FormGroup>
      { (!props.status.busy) &&
        <Button
          disabled={!props.status.available}
          onClick={createSubscription}
          style={{margin: 5}}
          >
          Create Subscription
        </Button>
      }
      { (props.status.busy) &&
        <Spinner />
      }
    </DataCard>
  );
}