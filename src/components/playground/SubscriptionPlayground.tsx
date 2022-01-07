import React, {useState, useEffect} from 'react';

import {
  HTMLSelect, Button, FormGroup, InputGroup, ControlGroup, Overlay, Classes, Card,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import { ApiHelper } from '../../util/ApiHelper';
import * as fhir4 from 'fhir4';
import * as fhir5 from 'fhir5';
import * as fhirCommon from '../../models/fhirCommon';
import SubscriptionFilters from './SubscriptionFilters';
import { IconNames } from '@blueprintjs/icons';
import ResourceSearchMultiCard from '../common/ResourceSarchCardMulti';
import { SubscriptionHelper, SubscriptionReturn } from '../../util/SubscriptionHelper';
import { StorageHelper } from '../../util/StorageHelper';
import ResourceSearchSingleCard from '../common/ResourceSarchCardSingle';

export interface SubscriptionPlaygroundProps {
  paneProps: ContentPaneProps,
  registerSubscription: ((subscription: fhir5.Subscription) => void),
  removeSubscription: ((index: number) => void),
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  selectedPatientId: string,
  endpoints: EndpointRegistration[],
  topics: fhir4.SubscriptionTopic[]|fhir5.SubscriptionTopic[],
  subscriptions: fhir5.Subscription[],
  registerPatientId: ((value: string) => void),
  registerGroupId: ((value: string) => void),
}

/** Component representing the Playground Subscription Card */
export default function SubscriptionPlayground(props: SubscriptionPlaygroundProps) {

  const info: DataCardInfo = {
    id: 'playground_subscription',
    heading: 'FHIR Server - Subscription Interactions',
    description: '',
    optional: false,
  };
  
  const emailTypes:string[] = [
    'text/html',
    'text/html;attach=application/fhir+json',
    'text/plain',
    'text/plain;attach=application/fhir+json',
  ]

  const [topicIndex, setTopicIndex] = useState<number>(-1);
  const [endpointIndex, setEndpointIndex] = useState<number>(-1);

  const [channelType, setChannelType] = useState<string>('rest-hook');

  const [emailAddress, setEmailAddress] = useState<string>('');
  const [emailMimeType, setEmailMimeType] = useState<string>(emailTypes[0]);

  const [payloadType, setPayloadType] = useState<string>('id-only');
  const [headers, setHeaders] = useState<string>('');

  const [filterByIndex, setFilterByIndex] = useState<number>(-1);
  const [filterByMatchTypeIndex, setFilterByMatchTypeIndex] = useState<number>(-1);
  const [filterByValue, setFilterByValue] = useState<string>('');

  const [manualFilterValue, setManualFilterValue] = useState<string>('');

  const [filters, setFilters] = useState<fhir5.SubscriptionFilterBy[]>([]);

  const [resourceName, setResourceName] = useState<string>('');
  const [showFilterSearchOverlay, setShowFilterSearchOverlay] = useState<boolean>(false);

  const [showSubscriptionSearchOverlay, setShowSubscriptionSearchOverlay] = useState<boolean>(false);

  const [externalEndpoint, setExternalEndpoint] = useState<string>('');

  const [zulipPmUserId, setZulipPmUserId] = useState<string>('');

  useEffect(() => {
    if (StorageHelper.isLocalStorageAvailable) {
        // update local settings
        if (localStorage.getItem('externalEndpoint')) {
          setExternalEndpoint(localStorage.getItem('externalEndpoint') || '');
        }
    }
  }, []);

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
      if (props.paneProps.useBackportToR4) {
        let topic: fhir4.SubscriptionTopic = props.topics[topicIndex] as fhir4.SubscriptionTopic;
        if ((!topic.canFilterBy) || (filterByIndex >= topic.canFilterBy!.length)) {
          setFilterByIndex(-1);
        }
        if ((filterByIndex < 0) &&
            (topic.canFilterBy) &&
            (topic.canFilterBy!.length > 0)) {
          setFilterByIndex(0);
        }
        if (filterByIndex > -1) {
          let filterBy: fhir5.SubscriptionTopicCanFilterBy = {
            filterParameter: topic.canFilterBy![filterByIndex].filterParameter,
            modifier: topic.canFilterBy![filterByIndex].modifier,
            description: topic.canFilterBy![filterByIndex].description,
          };
          if ((!filterBy.filterParameter) || (filterByMatchTypeIndex >= filterBy.modifier!.length)) {
            setFilterByMatchTypeIndex(-1);
          }
          if ((filterByMatchTypeIndex < 0) &&
              (filterBy.modifier) && 
              (filterBy.modifier!.length > 0)) {
            setFilterByMatchTypeIndex(0);
          }
        }
      } else {
        let topic: fhir5.SubscriptionTopic = props.topics[topicIndex] as fhir5.SubscriptionTopic;
        if ((!topic.canFilterBy) || (filterByIndex >= topic.canFilterBy!.length)) {
          setFilterByIndex(-1);
        }
        if ((filterByIndex < 0) &&
            (topic.canFilterBy) &&
            (topic.canFilterBy!.length > 0)) {
          setFilterByIndex(0);
        }
        if (filterByIndex > -1) {
          let filterBy: fhir5.SubscriptionTopicCanFilterBy = topic.canFilterBy![filterByIndex];
          if ((!filterBy.modifier) || (filterByMatchTypeIndex >= filterBy.modifier!.length)) {
            setFilterByMatchTypeIndex(-1);
          }
          if ((filterByMatchTypeIndex < 0) &&
              (filterBy.modifier) && 
              (filterBy.modifier!.length > 0)) {
            setFilterByMatchTypeIndex(0);
          }
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

    let header: string[] = (headers)
      ? headers.split(',')
      : [];

		var expirationTime:Date = new Date();
		expirationTime.setHours(expirationTime.getHours() + 1);

    let endpoint:string;
    let channelCoding:fhir5.Coding;
    let contentType:string = 'application/fhir+json';

    // determine the endpoint type
    switch (channelType) {
      case 'rest-hook':
        if (props.endpoints.length === 0) {
          props.paneProps.toaster('Invalid selection', IconNames.ERROR, 1000);
          props.updateStatus({...props.status, busy: false});
          return;
        } else if (endpointIndex < 0) {
          endpoint = new URL(`Endpoints/${props.endpoints[props.endpoints.length-1].uid}`, props.paneProps.clientHostInfo.url).toString();
          channelCoding = fhir5.SubscriptionChannelType.RestHook;
        } else {
          endpoint = new URL(`Endpoints/${props.endpoints[endpointIndex].uid}`, props.paneProps.clientHostInfo.url).toString();
          channelCoding = fhir5.SubscriptionChannelType.RestHook;
        }
        break;
      case 'rest-hook-external':
        if (externalEndpoint.length === 0) {
          props.paneProps.toaster('Invalid selection', IconNames.ERROR, 1000);
          props.updateStatus({...props.status, busy: false});
          return;
        } else if (!externalEndpoint.startsWith('http')) {
          props.paneProps.toaster('Invalid endpoint URL', IconNames.ERROR, 1000);
          props.updateStatus({...props.status, busy: false});
          return;
        } else {
          endpoint = externalEndpoint
          channelCoding = fhir5.SubscriptionChannelType.RestHook;
        }
        break;
      case 'websocket':
        endpoint = '';
        channelCoding = fhir5.SubscriptionChannelType.Websocket;
        break;
      case 'email':
        endpoint = emailAddress;
        contentType = emailMimeType;
        channelCoding = fhir5.SubscriptionChannelType.Email;
        break;
      case 'zulip':
        endpoint = '';
        channelCoding = fhirCommon.SubscriptionChannelTypeZulip;
        break;
      default:
        endpoint = '';
        channelCoding = {};
        break;
    }
      
		// build the subscription object
		let subscription: fhir5.Subscription = {
      resourceType: 'Subscription',
      endpoint: endpoint,
      channelType: channelCoding,
      heartbeatPeriod: 60,
      content: payloadType as fhir5.SubscriptionContentCodes,
      contentType: contentType,
			end: getInstantFromDate(expirationTime),
			topic: `${props.topics[topicIndex].url!}`,
			reason: 'Client Testing',
			status: fhir5.SubscriptionStatusCodes.REQUESTED,
    }

    // add zulip extensions
    if (channelType === 'zulip') {
      if (subscription.extension === undefined) {
        subscription.extension = [];
      }
      subscription.extension.push({
        url: 'http://fhir-extension.zulip.org/pm-user-id',
        valueString: `${zulipPmUserId}`,
      });
    }

    if (header.length > 0) {
      subscription.header = header;
    }

    if (filters.length > 0) {
      subscription.filterBy = filters;
    } else if (filterByValue.length > 0) {
      let filterValueActual:string = (filterByValue.indexOf('/') === -1)
        ? 'Patient/' + filterByValue
        : filterByValue;

      // create the filter object
      let filter:fhir5.SubscriptionFilterBy;
      
      if (props.paneProps.useBackportToR4) {
        let topic: fhir4.SubscriptionTopic = props.topics[topicIndex]! as fhir4.SubscriptionTopic;
        filter = {
          searchParamName: topic.canFilterBy![filterByIndex].filterParameter!,
          searchModifier: topic.canFilterBy![filterByIndex].modifier![filterByMatchTypeIndex] as unknown as fhir5.SubscriptionFilterBySearchModifierCodes,
          value: filterValueActual,
        };
      } else {
        let topic: fhir5.SubscriptionTopic = props.topics[topicIndex]! as fhir5.SubscriptionTopic;
        filter = {
          searchParamName: topic.canFilterBy![filterByIndex].filterParameter!,
          searchModifier: topic.canFilterBy![filterByIndex].modifier![filterByMatchTypeIndex] as unknown as fhir5.SubscriptionFilterBySearchModifierCodes,
          value: filterValueActual,
        };
      }

      // figure out patient IDs to list for encounters
      if ((filter.searchModifier === '=') &&
          ((filter.searchParamName === 'patient') || (filter.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
        props.registerPatientId(filter.value);
      }

      if ((filter.searchModifier === 'eq') &&
          ((filter.searchParamName === 'patient') || (filter.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
        props.registerPatientId(filter.value);
      }

      if ((filter.searchModifier === 'in') &&
          ((filter.searchParamName === 'patient') || (filter.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
        props.registerGroupId(filter.value);
      }

      subscription.filterBy = [filter];
    }

    // try to create the subscription
    let subscriptionReturn:SubscriptionReturn = await SubscriptionHelper.CreateSubscription(
      props.paneProps.useBackportToR4,
      props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4 : props.paneProps.fhirServerInfoR5,
      subscription,
      props.topics[topicIndex],
    );

    // fix the subscription record name
    let updated: SingleRequestData = {...subscriptionReturn.data,
      name: `Subscription #${props.data.length}`,
    };
    
    let updatedData: SingleRequestData[] = props.data.slice();
    updatedData.push(updated);
    props.setData(updatedData);

    if (subscriptionReturn.subscription) {
      setFilters([]);
      setFilterByValue('');
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
      props.subscriptions[dataRowIndex]);

    // fix the subscription record name
    let updated: SingleRequestData = {...subscriptionReturn.data,
      name: `Subscription #${dataRowIndex}`,
    };


    let updatedData: SingleRequestData[] = props.data.slice();
    updatedData.splice(dataRowIndex, 1, updated);
    props.setData(updatedData);
    props.updateStatus({...props.status, busy: false});
  }

  async function deleteSubscription(dataRowIndex: number) {
    props.updateStatus({...props.status, busy: true});

    let id:string = props.subscriptions[dataRowIndex].id!;

    try {
      ApiHelper.deleteSubscription(
        props.subscriptions[dataRowIndex].id!,
        props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.url : props.paneProps.fhirServerInfoR5.url,
        props.paneProps.useBackportToR4
      );

      // remove this subscription from the UI
      let updatedData: SingleRequestData[] = props.data.slice();
      updatedData.splice(dataRowIndex, 1);
      props.setData(updatedData);
      
      // deregister this subscription
      props.removeSubscription(dataRowIndex);

      return;
    } catch (err) {
      // remove the UI record anyway
      let updatedData: SingleRequestData[] = props.data.slice();
      updatedData.splice(dataRowIndex, 1);
      props.setData(updatedData);

      props.updateStatus({...props.status, busy: false});
    }
  }

  function registerSelectedIds(ids: string[]) {
    setFilterByValue(ids.join(','));
  }
  
  async function registerSelectedSubscription(id:string) {
    setShowSubscriptionSearchOverlay(false);

    // check to see if we already are tracking this subscription
    if (props.subscriptions.some(s => s.id === id)) {
      return;
    }

    // try to find the subscription
    let subscriptionReturn:SubscriptionReturn = await SubscriptionHelper.GetSubscription(
      props.paneProps.useBackportToR4,
      props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4 : props.paneProps.fhirServerInfoR5,
      id);

    // fix the subscription record name
    let updated: SingleRequestData = {...subscriptionReturn.data,
      name: `Subscription #${props.data.length}`,
    };
    
    let updatedData: SingleRequestData[] = props.data.slice();
    updatedData.push(updated);
    props.setData(updatedData);

    if (subscriptionReturn.subscription) {
      setFilters([]);
      setFilterByValue('');

      if ((subscriptionReturn.subscription.filterBy) &&
          (subscriptionReturn.subscription.filterBy!.length > 0)) {
        subscriptionReturn.subscription!.filterBy!.forEach(filter => {
          // figure out patient IDs to list for encounters
          if ((filter.searchModifier === '=') &&
              ((filter.searchParamName === 'Encounter?patient') ||
               (filter.searchParamName === 'patient') || 
               (filter.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
            props.registerPatientId(filter.value);
          }
    
          if ((filter.searchModifier === 'eq') &&
              ((filter.searchParamName === 'Encounter?patient') ||
               (filter.searchParamName === 'patient') || 
               (filter.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
            props.registerPatientId(filter.value);
          }
    
          if ((filter.searchModifier === 'in') &&
              ((filter.searchParamName === 'Encounter?patient') ||
               (filter.searchParamName === 'patient') || 
               (filter.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
            props.registerGroupId(filter.value);
          }
        });
      }

      // register this subscription (updates status)
      props.registerSubscription(subscriptionReturn.subscription);
    } else {
      props.updateStatus({...props.status, busy: false});
    }
  }

  function toggleFilterSearchOverlay() {
    if (!showFilterSearchOverlay) {
      let name: string = '';

      // determine our resource name
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

      if (props.paneProps.useBackportToR4) {
        let topic: fhir4.SubscriptionTopic = props.topics[topicIndex]! as fhir4.SubscriptionTopic;

        if ((filterByMatchTypeIndex < 0) || 
            (filterByMatchTypeIndex >= topic.canFilterBy![filterByIndex].modifier!.length)) {
          props.paneProps.toaster('Please select a match type before searching for filter values.', IconNames.WARNING_SIGN);
          return;
        }

        if (((topic.canFilterBy![filterByIndex].filterParameter === 'patient') ||
            (topic.canFilterBy![filterByIndex].filterParameter === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient')) &&
            (topic.canFilterBy![filterByIndex].modifier![filterByMatchTypeIndex] === '=')) {
          name = 'Patient';
        }

        if (((topic.canFilterBy![filterByIndex].filterParameter === 'patient') ||
            (topic.canFilterBy![filterByIndex].filterParameter === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient')) &&
            (topic.canFilterBy![filterByIndex].modifier![filterByMatchTypeIndex] === 'eq')) {
          name = 'Patient';
        }

        if (((topic.canFilterBy![filterByIndex].filterParameter === 'patient') ||
            (topic.canFilterBy![filterByIndex].filterParameter === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient')) &&
            (topic.canFilterBy![filterByIndex].modifier![filterByMatchTypeIndex] === 'in')) {
          name = 'Group';
        }

        if (((topic.canFilterBy![filterByIndex].filterParameter === 'patient') ||
            (topic.canFilterBy![filterByIndex].filterParameter === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient')) &&
            (topic.canFilterBy![filterByIndex].modifier![filterByMatchTypeIndex] === 'not-in')) {
          name = 'Group';
        }

      } else {
        let topic: fhir5.SubscriptionTopic = props.topics[topicIndex]! as fhir5.SubscriptionTopic;

        if ((filterByMatchTypeIndex < 0) || 
            (filterByMatchTypeIndex >= topic.canFilterBy![filterByIndex].modifier!.length)) {
          props.paneProps.toaster('Please select a match type before searching for filter values.', IconNames.WARNING_SIGN);
          return;
        }

        if (((topic.canFilterBy![filterByIndex].filterParameter === 'patient') ||
            (topic.canFilterBy![filterByIndex].filterParameter === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient')) &&
            (topic.canFilterBy![filterByIndex].modifier![filterByMatchTypeIndex] === '=')) {
          name = 'Patient';
        }

        if (((topic.canFilterBy![filterByIndex].filterParameter === 'patient') ||
            (topic.canFilterBy![filterByIndex].filterParameter === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient')) &&
            (topic.canFilterBy![filterByIndex].modifier![filterByMatchTypeIndex] === 'eq')) {
          name = 'Patient';
        }

        if (((topic.canFilterBy![filterByIndex].filterParameter === 'patient') ||
            (topic.canFilterBy![filterByIndex].filterParameter === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient')) &&
            (topic.canFilterBy![filterByIndex].modifier![filterByMatchTypeIndex] === 'in')) {
          name = 'Group';
        }

        if (((topic.canFilterBy![filterByIndex].filterParameter === 'patient') ||
            (topic.canFilterBy![filterByIndex].filterParameter === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient')) &&
            (topic.canFilterBy![filterByIndex].modifier![filterByMatchTypeIndex] === 'not-in')) {
          name = 'Group';
        }
      }

      // if there is no known resource name, disable for now
      if (!name) {
        props.paneProps.toaster('Search is not YET available for this combination', IconNames.WARNING_SIGN);
        return;
      }

      setResourceName(name);
    }

    setShowFilterSearchOverlay(!showFilterSearchOverlay);
  }

  function toggleSubscriptionSearchOverlay() {
    setShowSubscriptionSearchOverlay(!showSubscriptionSearchOverlay);
  }


  function addManualFilter() {
    if (manualFilterValue === '') {
      props.paneProps.toaster('Cannot add empty filters!', IconNames.ERROR);
      return;
    }

    let equalsIndex:number = manualFilterValue.indexOf('=');
    let colonIndex:number = manualFilterValue.indexOf(':');

    if ((equalsIndex === -1) && (colonIndex === -1)) {
      props.paneProps.toaster('Invalid filter format!', IconNames.ERROR);
      return;
    }

    let searchParamName:string;
    let searchModifier:string;
    let value:string;

    if (colonIndex !== -1) {
      searchParamName = manualFilterValue.substr(0, colonIndex);
      searchModifier = manualFilterValue.substr(colonIndex +1, (equalsIndex - colonIndex) - 1);
      value = manualFilterValue.substr(equalsIndex + 1);
    } else {
      searchParamName = manualFilterValue.substr(0, equalsIndex);
      searchModifier = '=';
      value = manualFilterValue.substr(equalsIndex + 1);
    }
    
    let rec:fhir5.SubscriptionFilterBy = {
      searchParamName: searchParamName,
      searchModifier: searchModifier as fhir5.SubscriptionFilterBySearchModifierCodes,
      value: value,
    };

    let updated: fhir5.SubscriptionFilterBy[] = filters.slice();
    updated.push(rec);

    // figure out patient IDs to list for encounters
    if ((rec.searchModifier === '=') &&
        ((rec.searchParamName === 'patient') || (rec.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
      props.registerPatientId(rec.value);
    }

    if ((rec.searchModifier === 'eq') &&
        ((rec.searchParamName === 'patient') || (rec.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
      rec.searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.EQUALS;
      props.registerPatientId(rec.value);
    }

    if ((rec.searchModifier === 'in') &&
        ((rec.searchParamName === 'patient') || (rec.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
      props.registerGroupId(rec.value);
    }

    // update state
    setFilters(updated);
    setManualFilterValue('');
  }

  function addFilter(replace?:boolean) {
    // sanity checks
    if (filterByValue === '') {
        props.paneProps.toaster('Cannot add empty filters!', IconNames.ERROR);
        return;
    }

    let filterValueActual:string = (filterByValue.indexOf('/') === -1)
      ? 'Patient/' + filterByValue
      : filterByValue;

    // create the filter object
    let rec: fhir5.SubscriptionFilterBy;
    
    if (props.paneProps.useBackportToR4) {
      let topic: fhir4.SubscriptionTopic = props.topics[topicIndex]! as fhir4.SubscriptionTopic;
      rec = {
        searchParamName: topic.canFilterBy![filterByIndex].filterParameter!,
        searchModifier: topic.canFilterBy![filterByIndex].modifier![filterByMatchTypeIndex] as unknown as fhir5.SubscriptionFilterBySearchModifierCodes,
        value: filterValueActual,
      };
    } else {
      let topic: fhir5.SubscriptionTopic = props.topics[topicIndex]! as fhir5.SubscriptionTopic;
      rec = {
        searchParamName: topic.canFilterBy![filterByIndex].filterParameter!,
        searchModifier: topic.canFilterBy![filterByIndex].modifier![filterByMatchTypeIndex] as unknown as fhir5.SubscriptionFilterBySearchModifierCodes,
        value: filterValueActual,
      };
    }

    // add this filter
    let updated: fhir5.SubscriptionFilterBy[] = 
      (replace === true) 
      ? []
      : filters.slice();
    updated.push(rec);

    // figure out patient IDs to list for encounters
    if ((rec.searchModifier === '=') &&
        ((rec.searchParamName === 'patient') || (rec.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
      props.registerPatientId(rec.value);
    }

    if ((rec.searchModifier === 'eq') &&
        ((rec.searchParamName === 'patient') || (rec.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
      rec.searchModifier = fhir5.SubscriptionFilterBySearchModifierCodes.EQUALS;
      props.registerPatientId(rec.value);
    }

    if ((rec.searchModifier === 'in') &&
        ((rec.searchParamName === 'patient') || (rec.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
      props.registerGroupId(rec.value);
    }


    // update state
    setFilters(updated);
    setFilterByValue('');
  }

  function removeFilter(index: number) {
    let updated: fhir5.SubscriptionFilterBy[] = filters.slice();
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

  function handleExternalEndpointChange(event: React.ChangeEvent<HTMLInputElement>) {
    setExternalEndpoint(event.target.value);
  }

  function handleZulipPmUserIdChange(event: React.ChangeEvent<HTMLInputElement>) {
    setZulipPmUserId(event.target.value);
  }

  /** Process HTML events for the payload type select box */
	function handleChannelTypeChange(event: React.FormEvent<HTMLSelectElement>) {
		setChannelType(event.currentTarget.value);
  }

  /** Process HTML events for the payload type select box */
	function handlePayloadTypeChange(event: React.FormEvent<HTMLSelectElement>) {
		setPayloadType(event.currentTarget.value);
  }

  /** Process HTML events for headers (update state for managed) */
  function handleHeadersChange(event: React.ChangeEvent<HTMLInputElement>) {
    setHeaders(event.target.value);
  }

  /** Process HTML events for email address (update state for managed) */
  function handleEmailAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmailAddress(event.target.value);
  }  

  /** Process HTML events for the mime type select box */
	function handleEmailMimeTypeChange(event: React.FormEvent<HTMLSelectElement>) {
		setEmailMimeType(event.currentTarget.value);
  }

  /** Process HTML events for the filter by name select box */
	function handleFilterByNameChange(event: React.FormEvent<HTMLSelectElement>) {
		setFilterByIndex(parseInt(event.currentTarget.value));
  }

  /** Process HTML events for the filter by match type select box */
	function handleFilterByMatchTypeChange(event: React.FormEvent<HTMLSelectElement>) {
		setFilterByMatchTypeIndex(parseInt(event.currentTarget.value));
  }

  /** Process HTML events for filter value (update state for managed) */
  function handleFilterByValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFilterByValue(event.target.value);
  }

  function handleManualFilterValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    setManualFilterValue(event.target.value);
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
      processRowDelete={deleteSubscription}
      >
      <FormGroup
        label='SubscriptionTopic'
        helperText='SubscriptionTopic this Subscription will generate notifications for'
        labelFor='subscriptiontopic'
        labelInfo={props.topics.length === 0 ? '(Requires SubscriptionTopic list from Topic Interaction Card)' : ''}
        >
        <HTMLSelect
          id='subscriptiontopic'
          onChange={handleTopicNameChange}
          value={topicIndex}
          >
          { Object.values(props.topics).map((value, index) => (
            <option key={value.title!} value={index}>SubscriptionTopic/{value.id!} ({value.title!})</option>
              ))}
        </HTMLSelect>
      </FormGroup>
      <FormGroup
        label='Channel Type'
        helperText='Type of channel to use for this subscription'
        labelFor='channel-type'
        >
        <HTMLSelect
          id='channel-type'
          onChange={handleChannelTypeChange}
          value={channelType}
          >
          <option key='email' value='email'>Email</option>
          <option key='rest-hook-external' value='rest-hook-external'>EXTERNAL REST Hook</option>
          <option key='rest-hook' value='rest-hook'>REST Hook</option>
          <option key='websocket' value='websocket'>Websocket</option>
          <option key='zulip' value='zulip'>Zulip (chat.fhir.org)</option>
        </HTMLSelect>
      </FormGroup>
      { (channelType === 'zulip') && [
        <FormGroup
          label='PM User Id'
          helperText='User ID this subscription will PM to'
          labelFor='zulip-pm-user-id'
          >
          <InputGroup
            id='zulip-pm-user-id'
            value={zulipPmUserId}
            onChange={handleZulipPmUserIdChange}
            />
        </FormGroup>,
        ]
      }
      { (channelType === 'rest-hook-external') && [
        <FormGroup
          label='Endpoint'
          helperText='Endpoint this Subscription will send notifications to'
          labelFor='endpoint'
          >
          <InputGroup
            id='external-endpoint'
            value={externalEndpoint}
            onChange={handleExternalEndpointChange}
            />
        </FormGroup>,
        <FormGroup
          label='Subscription Notification Headers'
          helperText='Comma (,) separated list of headers to include with notifications (per channel requirements)'
          labelFor='subscription-headers'
          >
          <InputGroup
            id='subscription-headers'
            placeholder='Authorization: Bearer secret-token-abc-123'
            value={headers}
            onChange={handleHeadersChange}
            />
        </FormGroup>,
        ]
      }
      { (channelType === 'rest-hook') && [
        <FormGroup
          label='Endpoint'
          helperText='Endpoint this Subscription will send notifications to'
          labelFor='endpoint'
          >
          <HTMLSelect
            id='endpoint'
            onChange={handleEndpointChange}
            value={endpointIndex}
            >
            { Object.values(props.endpoints).map((value, index) => (
              <option key={value.uid} value={index}>{value.name}</option>
                ))}``
          </HTMLSelect>
        </FormGroup>,
        <FormGroup
          label='Subscription Notification Headers'
          helperText='Comma (,) separated list of headers to include with notifications (per channel requirements)'
          labelFor='subscription-headers'
          >
          <InputGroup
            id='subscription-headers'
            placeholder='Authorization: Bearer secret-token-abc-123'
            value={headers}
            onChange={handleHeadersChange}
            />
        </FormGroup>,
        ]
      }
      { (channelType === 'email') && [
        <FormGroup
          label='Email Address'
          helperText='Email Address to send notifications.  Note that @mailinator.com email does NOT work, try https://getnada.com (which allows attachments).  Emails come from: subscriptions-at-ginoc-dot-org'
          labelFor='email-address'
          >
          <InputGroup
            id='email-address'
            value={emailAddress}
            onChange={handleEmailAddressChange}
            />
        </FormGroup>,
        <FormGroup
          label='Email Type'
          helperText='MIME Type'
          labelFor='email-type'
          >
          <HTMLSelect
            id='email-type'
            onChange={handleEmailMimeTypeChange}
            value={emailMimeType}
            >
            { emailTypes.map((value) => (
              <option key={value}>{value}</option> 
                ))}
          </HTMLSelect>
        </FormGroup>
        ]
      }
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
          { Object.values(fhir5.SubscriptionContentCodes).map((value) => (
            <option key={value}>{value}</option> 
              ))}
        </HTMLSelect>
      </FormGroup>
      { ((topicIndex > -1) && (props.topics[topicIndex].canFilterBy)) &&
        <FormGroup
          label='Filter by'
          helperText={'Filter based on the available SubscriptionTopic Filters (Search Parameters).' +
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
              { (props.paneProps.useBackportToR4) &&
                Object.values((props.topics[topicIndex] as fhir4.SubscriptionTopic).canFilterBy!).map((value, index) => (
                <option key={value.filterParameter} value={index}>{value.filterParameter}</option>
              )) }

              { (!props.paneProps.useBackportToR4) &&
                Object.values((props.topics[topicIndex] as fhir5.SubscriptionTopic).canFilterBy!).map((value, index) => (
                <option key={value.filterParameter} value={index}>{value.filterParameter}</option>
              )) }

            </HTMLSelect>
            <HTMLSelect
              onChange={handleFilterByMatchTypeChange}
              value={filterByMatchTypeIndex}
              >
              { ((filterByIndex > -1) && (props.paneProps.useBackportToR4)) && 
                Object.values((props.topics[topicIndex] as fhir4.SubscriptionTopic).canFilterBy![filterByIndex].modifier!).map((value, index) => (
                <option key={`opt_${index}`} value={index}>{value}</option>
              ))}

              { ((filterByIndex > -1) && (!props.paneProps.useBackportToR4)) && 
                Object.values((props.topics[topicIndex] as fhir5.SubscriptionTopic).canFilterBy![filterByIndex].modifier!).map((value, index) => (
                <option key={`opt_${index}`} value={index}>{value}</option>
              ))}
            </HTMLSelect>
            <InputGroup
              id='filter-by-value'
              value={filterByValue}
              onChange={handleFilterByValueChange}
              />
            <Button
              onClick={toggleFilterSearchOverlay}
              >
              Search
            </Button>
            <Button
              onClick={() => addFilter()}
              >
              Add Filter
            </Button>
            <Button
              onClick={createSubscription}
              >
              Quick Create
              </Button>
          </ControlGroup>
        </FormGroup>
      }
      { ((topicIndex > -1) && (!props.topics[topicIndex].canFilterBy)) &&
        <FormGroup
          label='Filter by'
          helperText={'Enter manual filters - Topic information is not available (backport limitation).' +
            ' At least one filter is REQUIRED (R4 Subscription.criteria).' +
            ' Multiple VALUES can be entered comma separated for OR joining.' +
            ' Multiple FILTERS are joined with AND.' + 
            ' First filter REQUIRES resource (e.g., Encounter?patient=patient/123)'
            }
          labelFor='manual-filter'
          >
          <ControlGroup
            id='manual-filter'
            >
            <InputGroup
              id='manual-filter-value'
              value={manualFilterValue}
              onChange={handleManualFilterValueChange}
              />
            <Button
              onClick={addManualFilter}
              >
              Add Filter
            </Button>
          </ControlGroup>
        </FormGroup>
      }
      <Overlay 
        isOpen={showFilterSearchOverlay}
        onClose={toggleFilterSearchOverlay}
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
            dismissOverlay={toggleFilterSearchOverlay}
            />
        </Card>
      </Overlay>
      <Overlay 
        isOpen={showSubscriptionSearchOverlay}
        onClose={toggleSubscriptionSearchOverlay}
        className={Classes.OVERLAY_SCROLL_CONTAINER}
        usePortal={false}
        autoFocus={true}
        hasBackdrop={true}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        >
        <Card className='centered'>
          <ResourceSearchSingleCard
            paneProps={props.paneProps}
            setData={(data: SingleRequestData[]) => {}}
            resourceName='Subscription'
            registerSelectedId={registerSelectedSubscription}
            />
        </Card>
      </Overlay>
      <SubscriptionFilters
        filters={filters}
        removeFilter={removeFilter}
        useBackportToR4={props.paneProps.useBackportToR4}
        />
      <Button
        disabled={(!props.status.available) || 
                  (props.status.busy) || 
                  (topicIndex < 0)}
        onClick={createSubscription}
        style={{margin: 5}}
        >
        Create Subscription
      </Button>
      <Button
        onClick={toggleSubscriptionSearchOverlay}
        >
        Search
      </Button>

    </DataCard>
  );
}