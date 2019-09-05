import React, {useState, useEffect} from 'react';

import {
  HTMLSelect, Button, FormGroup, InputGroup, ControlGroup,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import { ApiHelper } from '../../util/ApiHelper';
import * as fhir from '../../models/fhir_r4_selected';

export interface SubscriptionPlaygroundProps {
  paneProps: ContentPaneProps,
  registerSubscription: ((subscription: fhir.Subscription) => void),
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  selectedPatientId: string,
  endpoints: EndpointRegistration[],
  topics: fhir.Topic[],
}

/** Component representing the Playground Subscription Card */
export default function SubscriptionPlayground(props: SubscriptionPlaygroundProps) {

  const info: DataCardInfo = {
    id: 'playground_subscription',
    heading: 'FHIR Server - Subscription Interactions',
    description: '',
    optional: false,
  };
  
  const [topicIndex, setTopicIndex] = useState<number>(-1);
  const [endpointIndex, setEndpointIndex] = useState<number>(-1);

  const [payloadType, setPayloadType] = useState<string>('id-only');
  const [headers, setHeaders] = useState<string>('Authorization: Bearer secret-token-abc-123');

  const [filterByIndex, setFilterByIndex] = useState<number>(-1);
  const [filterByMatchTypeIndex, setFilterByMatchTypeIndex] = useState<number>(-1);
  const [filterByValue, setFilterByValue] = useState<string>('');

  useEffect(() => {
    if (endpointIndex >= props.endpoints.length) {
      setEndpointIndex(-1);
    }
    if ((endpointIndex < 0) && (props.endpoints.length > 0)) {
      setEndpointIndex(0);
    }
  }, [endpointIndex, props.endpoints]);

  useEffect(() => {
    if (topicIndex >= props.topics.length) {
      setTopicIndex(-1);
    }
    if ((topicIndex < 0) && (props.topics.length > 0)) {
      setTopicIndex(0);
    }

    if ((topicIndex === -1) && 
        ((filterByIndex !== -1) || (filterByMatchTypeIndex !== -1))) {
      setFilterByIndex(-1);
      setFilterByMatchTypeIndex(-1);
    }

    if (topicIndex > -1) {
      let topic: fhir.Topic = props.topics[topicIndex];
      if ((!topic.canFilterBy) || (filterByIndex >= topic.canFilterBy!.length)) {
        setFilterByIndex(-1);
      }
      if ((filterByIndex < 0) &&
          (topic.canFilterBy) &&
          (topic.canFilterBy!.length > 0)) {
        setFilterByIndex(0);
      }
      if (filterByIndex > -1) {
        let filterBy: fhir.TopicCanFilterBy = topic.canFilterBy![filterByIndex];
        if ((!filterBy.matchType) || (filterByMatchTypeIndex >= filterBy.matchType!.length)) {
          setFilterByMatchTypeIndex(-1);
        }
        if ((filterByMatchTypeIndex < 0) &&
            (filterBy.matchType) && 
            (filterBy.matchType!.length > 0)) {
          setFilterByMatchTypeIndex(0);
        }
      }
    }
  }, [topicIndex, props.topics, filterByIndex, filterByMatchTypeIndex]);

  /** Get a FHIR Instant value from a JavaScript Date */
	function getInstantFromDate(date: Date) {
		return (JSON.stringify(date).replace(/['"]+/g, ''));
  }
  
  function createSubscription() {
    props.updateStatus({...props.status, busy: true});

		// **** build the url for our call ***

    let url: string = new URL('Subscription/', props.paneProps.fhirServerInfo.url).toString();
    let endpointUrl: string = new URL(`Endpoints/${props.endpoints[endpointIndex].uid}`, props.paneProps.clientHostInfo.url).toString();

    let header: string[] = (headers)
      ? headers.split(',')
      : [];

		// **** build our subscription channel information ****

		let channel: fhir.SubscriptionChannel = {
			endpoint: endpointUrl,
			header: header,
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
          requestData: JSON.stringify(subscription, null, 2),
          requestDataType: RenderDataAsTypes.FHIR,
          responseData: JSON.stringify(value, null, 2),
          responseDataType: RenderDataAsTypes.FHIR,
          };

        props.setData([updated]);

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

        props.setData([updated]);
        props.updateStatus({...props.status, busy: false});
			});
  }

  /** Process HTML events for the topic select box */
	function handleTopicNameChange(event: React.FormEvent<HTMLSelectElement>) {
		setTopicIndex(parseInt(event.currentTarget.value));
  }

  /** Process HTML events for the endpoint select box */
  function handleEndpointChange(event: React.FormEvent<HTMLSelectElement>) {
    setEndpointIndex(parseInt(event.currentTarget.value));
  }

  /** Process HTML events for the payload type select box */
	function handlePayloadTypeChange(event: React.FormEvent<HTMLSelectElement>) {
		setPayloadType(event.currentTarget.value);
  }

  /** Process HTML events for headers (update state for managed) */
  function handleHeadersChange(event: React.ChangeEvent<HTMLInputElement>) {
    setHeaders(event.target.value);
  }

  /** Process HTML events for the filter by name select box */
	function handleFilterByNameChange(event: React.FormEvent<HTMLSelectElement>) {
		setFilterByIndex(parseInt(event.currentTarget.value));
  }

  /** Process HTML events for the filter by match type select box */
	function handleFilterByMatchTypeChange(event: React.FormEvent<HTMLSelectElement>) {
		setFilterByMatchTypeIndex(parseInt(event.currentTarget.value));
  }

  /** Process HTML events for filter balue (update state for managed) */
  function handleFilterByValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFilterByValue(event.target.value);
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
        label='Topic'
        helperText='Topic this Subscription will generate notifications for'
        labelFor='topic'
        labelInfo={props.topics.length === 0 ? '(Requires Topic list from Topic Interaction Card)' : ''}
        >
        <HTMLSelect
          id='topic'
          onChange={handleTopicNameChange}
          value={topicIndex}
          >
          { Object.values(props.topics).map((value, index) => (
            <option key={value.title!} value={index}>{value.title!}</option>
              ))}
        </HTMLSelect>
      </FormGroup>
      <FormGroup
        label='Endpoint'
        helperText='Endpoint this topic will send notifications to'
        labelFor='endpoint'
        >
        <HTMLSelect
          id='endpoint'
          onChange={handleEndpointChange}
          value={endpointIndex}
          >
          { Object.values(props.endpoints).map((value, index) => (
            <option key={value.uid} value={index}>{value.name}</option>
              ))}
        </HTMLSelect>
      </FormGroup>
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
      { ((topicIndex > -1) && (props.topics[topicIndex].canFilterBy)) &&
        <FormGroup
          label='Filter by'
          helperText='Filter based on the available Topic Filters (Search Parameters). Leave blank for no filter.'
          labelFor='filter-by'
          >
          <ControlGroup
            id='filter-by'
            >
            <HTMLSelect
              onChange={handleFilterByNameChange}
              value={filterByIndex}
              >
              { Object.values(props.topics[topicIndex].canFilterBy!).map((value, index) => (
                <option key={value.name} value={index}>{value.name}</option>
              )) }
            </HTMLSelect>
            <HTMLSelect
              onChange={handleFilterByMatchTypeChange}
              value={filterByMatchTypeIndex}
              >
              { (filterByIndex > -1) && 
                Object.values(props.topics[topicIndex].canFilterBy![filterByIndex].matchType!).map((value, index) => (
                <option key={`opt_${index}`} value={index}>{value}</option>
              ))}
            </HTMLSelect>
            <InputGroup
              id='filter-by-value'
              value={filterByValue}
              onChange={handleFilterByValueChange}
              />
          </ControlGroup>
        </FormGroup>
      }

      <Button
        disabled={(!props.status.available) || 
                  (props.status.busy) || 
                  (topicIndex < 0) || 
                  (endpointIndex < 0) ||
                  (true)}
        onClick={createSubscription}
        style={{margin: 5}}
        >
        Create Subscription
      </Button>
    </DataCard>
  );
}