import React, {useState, useEffect} from 'react';

import {
  HTMLSelect, Button, FormGroup, InputGroup, ControlGroup, Overlay, Classes, Card,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import { ApiHelper, ApiResponse } from '../../util/ApiHelper';
import * as fhir from '../../models/fhir_r4_selected';
import SubscriptionFilters from './SubscriptionFilters';
import { IconNames } from '@blueprintjs/icons';
import ResourceSearchMultiCard from '../common/ResourceSarchCardMulti';

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
  const [headers, setHeaders] = useState<string>('');

  const [filterByIndex, setFilterByIndex] = useState<number>(-1);
  const [filterByMatchTypeIndex, setFilterByMatchTypeIndex] = useState<number>(-1);
  const [filterByValue, setFilterByValue] = useState<string>('');

  const [filters, setFilters] = useState<fhir.SubscriptionFilterBy[]>([]);

  const [resourceName, setResourceName] = useState<string>('');
  const [showSearchOverlay, setShowSearchOverlay] = useState<boolean>(false);

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
  
  async function createSubscription() {
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

		// // **** build our filter information ****

		// let filter: fhir.SubscriptionFilterBy = {
		// 	matchType: '=',
		// 	name: 'patient',
		// 	value: `Patient/${props.selectedPatientId}`	    //`Patient/${patientFilter},Patient/K123`
		// }

		var expirationTime:Date = new Date();
		expirationTime.setHours(expirationTime.getHours() + 1);

		// **** build the subscription object ****

		let subscription: fhir.Subscription = {
			resourceType: 'Subscription',
			channel: channel,
			filterBy: filters,
			end: getInstantFromDate(expirationTime),
			topic: {reference:  `Topic/${props.topics[topicIndex].id!}`},
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

  function registerSelectedIds(ids: string[]) {
    setFilterByValue(ids.join(','));
  }

  function toggleSearchOverlay() {
    if (!showSearchOverlay) {
      let name: string = '';

      // **** determine our resource name ****

      if ((topicIndex < 0) || 
          (topicIndex >= props.topics.length)) {
        props.paneProps.toaster('Please select a Topic prior to searching for filter values.', IconNames.WARNING_SIGN);
        return;
      }

      if ((filterByIndex < 0) || 
          (filterByIndex >= props.topics[topicIndex].canFilterBy!.length)) {
        props.paneProps.toaster('Please select a filter parameter before searching for filter values.', IconNames.WARNING_SIGN);
        return;
      }

      if ((filterByMatchTypeIndex < 0) || 
          (filterByMatchTypeIndex >= props.topics[topicIndex].canFilterBy![filterByIndex].matchType!.length)) {
        props.paneProps.toaster('Please select a match type before searching for filter values.', IconNames.WARNING_SIGN);
        return;
      }

      if ((props.topics[topicIndex].canFilterBy![filterByIndex].name === 'patient') &&
          (props.topics[topicIndex].canFilterBy![filterByIndex].matchType![filterByMatchTypeIndex] === '=')) {
        name = 'Patient';
      }

      if ((props.topics[topicIndex].canFilterBy![filterByIndex].name === 'patient') &&
          (props.topics[topicIndex].canFilterBy![filterByIndex].matchType![filterByMatchTypeIndex] === 'in')) {
        name = 'Group';
      }

      if ((props.topics[topicIndex].canFilterBy![filterByIndex].name === 'patient') &&
          (props.topics[topicIndex].canFilterBy![filterByIndex].matchType![filterByMatchTypeIndex] === 'not-in')) {
        name = 'Group';
      }

      // **** if there is no known resource name, disable for now ****

      if (!name) {
        props.paneProps.toaster('Search is not YET available for this combination', IconNames.WARNING_SIGN);
        return;
      }

      setResourceName(name);
    }

    setShowSearchOverlay(!showSearchOverlay);
  }

  function addFilter() {
    // **** sanity checks ****

    if (filterByValue === '') {
        props.paneProps.toaster('Cannot add empty filters!', IconNames.ERROR);
        return;
    }

    // **** add this filter ****

    let updated: fhir.SubscriptionFilterBy[] = filters.slice();
    updated.push({
      name: props.topics[topicIndex].canFilterBy![filterByIndex].name!,
      matchType: props.topics[topicIndex].canFilterBy![filterByIndex].matchType![filterByMatchTypeIndex],
      value: filterByValue,
    });

    // **** update state ****

    setFilters(updated);
    setFilterByValue('');
  }

  function removeFilter(index: number) {
    let updated: fhir.SubscriptionFilterBy[] = filters.slice();
    updated.splice(index);
    setFilters(updated);
  }

  /** Process HTML events for the topic select box */
	function handleTopicNameChange(event: React.FormEvent<HTMLSelectElement>) {
    if (parseInt(event.currentTarget.value) === topicIndex) {
      return;
    }
    setTopicIndex(parseInt(event.currentTarget.value));
    setFilters([]);
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
            <option key={value.title!} value={index}>Topic/{value.id!} ({value.title!})</option>
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
          placeholder='Authorization: Bearer secret-token-abc-123'
          value={headers}
          onChange={handleHeadersChange}
          />
      </FormGroup>
      { ((topicIndex > -1) && (props.topics[topicIndex].canFilterBy)) &&
        <FormGroup
          label='Filter by'
          helperText={'Filter based on the available Topic Filters (Search Parameters).' +
            ' Leave blank for no filter.' +
            ' Multiple VALUES can be entered comma separated for OR joining.' +
            ' Multiple FILTERS are joined with AND.'
            }
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
            <Button
              onClick={toggleSearchOverlay}
              >
              Search
            </Button>
            <Button
              onClick={addFilter}
              >
              Add Filter
            </Button>
          </ControlGroup>
        </FormGroup>
      }
      <Overlay 
        isOpen={showSearchOverlay}
        onClose={toggleSearchOverlay}
        className={Classes.OVERLAY_SCROLL_CONTAINER}
        usePortal={false}
        autoFocus={true}
        hasBackdrop={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        >
        <Card className='centered'>
          <ResourceSearchMultiCard
            paneProps={props.paneProps}
            setData={(data: SingleRequestData[]) => {}}
            resourceName={resourceName}
            registerSelectedIds={registerSelectedIds}
            dismissOverlay={toggleSearchOverlay}
            />
        </Card>
      </Overlay>
      <SubscriptionFilters
        filters={filters}
        removeFilter={removeFilter}
        />
      <Button
        disabled={(!props.status.available) || 
                  (props.status.busy) || 
                  (topicIndex < 0) || 
                  (endpointIndex < 0)}
        onClick={createSubscription}
        style={{margin: 5}}
        >
        Create Subscription
      </Button>
    </DataCard>
  );
}