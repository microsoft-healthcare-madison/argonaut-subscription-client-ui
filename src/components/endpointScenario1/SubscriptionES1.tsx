import React, {useState} from 'react';

import {
  HTMLSelect, Button, FormGroup, InputGroup, Overlay, Card, Classes,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import * as fhir4 from '../../local_dts/fhir4';
import * as fhir5 from '../../local_dts/fhir5';
import * as fhirCommon from '../../models/fhirCommon';
import { SubscriptionReturn, SubscriptionHelper } from '../../util/SubscriptionHelper';
import { IconNames } from '@blueprintjs/icons';
import ResourceSearchSingleCard from '../common/ResourceSarchCardSingle';

export interface SubscriptionES1Props {
  paneProps: ContentPaneProps,
  registerSubscription: ((subscription?: fhir5.Subscription) => void),
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  selectedPatientId: string,
  registerSelectedPatientId: ((id: string) => void),
  topic: fhir4.SubscriptionTopic|fhir5.SubscriptionTopic|null,
  subscription: fhir5.Subscription,
}

/** Component representing the Scenario 1 Subscription Card */
export default function SubscriptionES1(props: SubscriptionES1Props) {

  const info: DataCardInfo = {
    id: 's1_subscription',
    stepNumber: 4,
    heading: 'Request a Subscription on the FHIR Server',
    description: '',
    optional: false,
  };
  
  const [payloadType, setPayloadType] = useState<string>('id-only');
  const [headers, setHeaders] = useState<string>('');

  const [endpointUrl, setEndpointUrl] = useState<string>('');

  const [showSubscriptionSearchOverlay, setShowSubscriptionSearchOverlay] = useState<boolean>(false);

  /** Get a FHIR Instant value from a JavaScript Date */
	function getInstantFromDate(date: Date) {
		return (JSON.stringify(date).replace(/['"]+/g, ''));
  }
  
  async function createSubscription() {
    const urlValidationExp:RegExp = /^(http|https):\/\/[^ "]+$/;
    if (!urlValidationExp.test(endpointUrl)) {
      props.paneProps.toaster(`Invalid Endpoint URL: ${endpointUrl} - must begin with http:// or https://`, IconNames.ERROR, 2000);
      props.updateStatus({...props.status, busy: false});
      return;
    }

    props.updateStatus({...props.status, busy: true});

    // flag our parent to clear any old subscriptions
    props.registerSubscription();

    // TODO: check endpoint present and somewhat valid

		// build our filter information
		let filter: fhir5.SubscriptionFilterBy = {
			searchModifier: '=',
			searchParamName: 'patient',
			value: `Patient/${props.selectedPatientId}`
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


  async function registerSelectedSubscription(id:string) {
    setShowSubscriptionSearchOverlay(false);

    // try to find the subscription
    let subscriptionReturn:SubscriptionReturn = await SubscriptionHelper.GetSubscription(
      props.paneProps.useBackportToR4,
      props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4 : props.paneProps.fhirServerInfoR5,
      id);

    // fix the subscription record name
    let updated: SingleRequestData = {...subscriptionReturn.data,
      name: `Subscription #${props.data.length}`,
    };

    props.setData([updated]);

    if (subscriptionReturn.subscription) {
      if ((subscriptionReturn.subscription.filterBy) &&
          (subscriptionReturn.subscription.filterBy!.length > 0)) {
        subscriptionReturn.subscription!.filterBy!.forEach(filter => {
          let id:string = filter.value.startsWith('Patient/')
            ? filter.value.substr(8)
            : filter.value;

          // figure out patient IDs to list for encounters
          if ((filter.searchModifier === '=') &&
              ((filter.searchParamName === 'Encounter?patient') ||
               (filter.searchParamName === 'patient') || 
               (filter.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
            props.registerSelectedPatientId(id);
          }
    
          if ((filter.searchModifier === 'eq') &&
              ((filter.searchParamName === 'Encounter?patient') ||
               (filter.searchParamName === 'patient') || 
               (filter.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
            props.registerSelectedPatientId(id);
          }
    
          if ((filter.searchModifier === 'in') &&
              ((filter.searchParamName === 'Encounter?patient') ||
               (filter.searchParamName === 'patient') || 
               (filter.searchParamName === 'http://hl7.org/fhir/build/SearchParameter/Encounter-patient'))) {
            props.registerSelectedPatientId(id);
          }
        });
      }

      // register this subscription (updates status)
      props.registerSubscription(subscriptionReturn.subscription);
    } else {
      props.updateStatus({...props.status, busy: false});
    }
  }

  function toggleSubscriptionSearchOverlay() {
    setShowSubscriptionSearchOverlay(!showSubscriptionSearchOverlay);
  }

  /** Process HTML events for the payload type select box */
	function handlePayloadTypeChange(event: React.FormEvent<HTMLSelectElement>) {
		setPayloadType(event.currentTarget.value);
  }

  /** Process HTML events for endpoint url (update state for managed) */
  function handleEndpointUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEndpointUrl(event.target.value);
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
      <FormGroup
        label='Subscription Notification Endpoint'
        helperText='Full URL of the REST Hook Endpoint'
        labelFor='subscription-endpoint'
        >
        <InputGroup 
          id='subscription-endppint'
          value={endpointUrl}
          onChange={handleEndpointUrlChange}
          />
      </FormGroup>
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
      <Button
        onClick={toggleSubscriptionSearchOverlay}
        >
        Search
      </Button>
    </DataCard>
  );
}