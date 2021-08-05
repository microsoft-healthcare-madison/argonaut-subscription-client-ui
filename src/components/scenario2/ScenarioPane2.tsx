import React, { useState, useEffect } from 'react';

import {
  Card,
  Elevation,
  Text,
  H3, NonIdealState,
} from '@blueprintjs/core';

import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import { ApiHelper } from '../../util/ApiHelper';
import * as fhir4 from '../../local_dts/fhir4';
import * as fhir5 from '../../local_dts/fhir5';
import * as fhirCommon from '../../models/fhirCommon';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import { DataCardStatus } from '../../models/DataCardStatus';
import TopicS2 from './TopicS2';
import EndpointS2 from './EndpointS2';
import SubscriptionS2 from './SubscriptionS2';
import HandshakeS2 from './HandshakeS2';
import TriggerS2 from './TriggerS2';
import NotificationS2 from './NotificationS2';
import CleanUpS2 from './CleanUpS2';
import GroupS2 from './GroupS2';
import { NotificationReturn, NotificationHelper } from '../../util/NotificationHelper';

/**
 * Walks a user through the steps of Scenario 2
 */
export default function ScenarioPane2(props: ContentPaneProps) {

	const _statusAvailable: DataCardStatus = {available: true, complete: false, busy: false};
	const _statusNotAvailable: DataCardStatus = {available: false, complete: false, busy: false};
	const _statusBusy: DataCardStatus = {available: true, complete: false, busy: true};
	const _statusComplete: DataCardStatus = {available: true, complete: true, busy: false};

	const [connected, setConnected] = useState<boolean>(true);
	
	const [topicData, setTopicData] = useState<SingleRequestData[]>([]);
	const [topicStatus, setTopicStatus] = useState<DataCardStatus>(_statusAvailable);
	const [selectedTopic, setSelectedTopic] = useState<fhir4.SubscriptionTopic|fhir5.SubscriptionTopic|null>(null); 
	
	const [groupData, setGroupData] = useState<SingleRequestData[]>([]);
	const [groupStatus, setGroupStatus] = useState<DataCardStatus>(_statusAvailable);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [groupPatientIds, setGroupPatientIds] = useState<string[]>([]);
	
	const [endpointData, setEndpointData] = useState<SingleRequestData[]>([]);
	const [endpointStatus, setEndpointStatus] = useState<DataCardStatus>(_statusNotAvailable);
	const [endpoint, setEndpoint] = useState<EndpointRegistration | null>(null);

	const [subscriptionData, setSubscriptionData] = useState<SingleRequestData[]>([]);
	const [subscriptionStatus, setSubscriptionStatus] = useState<DataCardStatus>(_statusNotAvailable);
	const [subscription, setSubscription] = useState<fhir5.Subscription | null>(null);

	const [handshakeData, setHandshakeData] = useState<SingleRequestData[]>([]);
	const [handshakeStatus, setHandshakeStatus] = useState<DataCardStatus>(_statusNotAvailable);

	const [triggerData, setTriggerData] = useState<SingleRequestData[]>([]);
	const [triggerStatus, setTriggerStatus] = useState<DataCardStatus>(_statusNotAvailable);
	const [triggerCount, setTriggerCount] = useState<number>(0);

	const [notificationData, setNotificationData] = useState<SingleRequestData[]>([]);
	const [notificationStatus, setNotificationStatus] = useState<DataCardStatus>(_statusNotAvailable);

	const [cleanUpData, setCleanUpData] = useState<SingleRequestData[]>([]);
	const [cleanUpStatus, setCleanUpStatus] = useState<DataCardStatus>(_statusAvailable);
	
	useEffect(() => {
		/** Determine if the client is connected enough to proceed and update state accordingly */
		function checkIfConnected() {
			let lastState: boolean = connected;
			let nextState: boolean;

			// check to make sure we are connected to the host (requires server)
			if (props.clientHostInfo.status !== 'ok') {
				nextState = false;
			} else {
				nextState = true;
			}

			// update state (if necessary)
			if (lastState !== nextState) {
				setConnected(nextState);
			}
		}

		checkIfConnected();

		props.registerHostMessageHandler(handleHostMessage);
	});

	// check for not being connected
  if (!connected) {
		return (
		<div id='mainContent'>
			<Card elevation={Elevation.TWO}>
				<NonIdealState
					icon={IconNames.ISSUE}
					title='Not Connected'
					description='You must be connected to a FHIR Server and Client Host before running this scenario.'
					/>
			</Card>
		</div>
		);
	}

	/** Disable from the specified step onward and clean any artefacts from existing runs */
	function disableSteps(startingAt: number) {
		if (startingAt > 8) {
			return;
		}

		if (startingAt <= 2) {
      setSelectedGroupId('');
      setGroupPatientIds([]);
      setGroupData([]);
			setGroupStatus(_statusAvailable);
		}

		if (startingAt <= 3) {
			if (endpoint) {
				ApiHelper.deleteEndpoint(
					props.clientHostInfo.registration, 
					endpoint.uid!,
					props.clientHostInfo.url
					);
			}
			setEndpoint(null);
			setEndpointData([]);
			setEndpointStatus(_statusNotAvailable);
		}

		if (startingAt <= 4) {
			if (subscription) {
				ApiHelper.deleteSubscription(
					subscription.id!,
					props.useBackportToR4 ? props.fhirServerInfoR4.url : props.fhirServerInfoR5.url,
					props.useBackportToR4);
			}
			setSubscription(null);
			setSubscriptionData([]);
			setSubscriptionStatus(_statusNotAvailable);
		}

		if (startingAt <= 5) {
			setHandshakeData([]);
			setHandshakeStatus(_statusNotAvailable);
		}

		if (startingAt <= 6) {
			setTriggerCount(0);
			setTriggerData([]);
			setTriggerStatus(_statusNotAvailable);
		}

		if (startingAt <= 7) {
			setNotificationData([]);
			setNotificationStatus(_statusNotAvailable);
		}

		if (startingAt <= 8) {
			setCleanUpData([]);
			setCleanUpStatus(_statusAvailable);
		}
	}

	/** Reset this scenario to clean state */
	function cleanUp() {
		// flag busy
		setCleanUpStatus(_statusBusy);

		let info: string = 'Cleaning up...\n';

		// build our string
		if (subscription) {
			info += `\tRemoved subscription: ${subscription.id!}\n`;
		}

		if (endpoint) {
			info += `\tRemoved endpoint: ${endpoint.uid!}\n`;
		}

		info += '\tCleaned internal steps.\n'
		info += `Cleaned at: ${Date()}`;

		// reset to step 2 (removes endpoints and subscriptions)
		disableSteps(2);

		// done
		let data: SingleRequestData = {
			id: 'cleanup',
			name: 'Clean Up',
			info: info,
		}

		setCleanUpData([data]);
		setCleanUpStatus(_statusComplete);
	}

	/** Register an encounter has been sent by the trigger card */
	function registerEncounterSent() {
		// increment our number of events we are waiting on
		setTriggerCount(triggerCount + 1);

		// update status
		setTriggerStatus(_statusComplete);
		setNotificationStatus(_statusBusy);
	}

	/** Register a subscription as active in this scenario */
	function registerSubscription(value?: fhir5.Subscription) {
		
		if (!value)
		{
			// disable subsequent steps
			disableSteps(5);

			// check for an old subscription
			if (subscription) {
				ApiHelper.deleteSubscription(
					subscription.id!,
					props.useBackportToR4 ? props.fhirServerInfoR4.url : props.fhirServerInfoR5.url,
					props.useBackportToR4);
				setSubscription(null);
			}

			// flag we are waiting on subscription handshake
			setHandshakeStatus(_statusBusy);

			// done
			return;
		}

		// save subscription
		setSubscription(value);

		// update status
		setSubscriptionStatus(_statusComplete);
	}

	/** Register an endpoint as active in this scenario */
	function registerEndpoint(value: EndpointRegistration) {
		// disable subsequent steps
		disableSteps(4);

		// check for an old endpoint
		if (endpoint) {
			ApiHelper.deleteEndpoint(
				props.clientHostInfo.registration,
				endpoint.uid!,
				props.clientHostInfo.url);
		}

		// save endpoint
		setEndpoint(value);

		// update status
		setEndpointStatus(_statusComplete);
		setSubscriptionStatus(_statusAvailable);
  }

	/** Register a group id as active in this scenario */
	function registerSelectedGroupId(id: string, patientIds: string[]) {
		// disable subsequent steps
		disableSteps(3);

    // save group and patient ids
    setSelectedGroupId(id);
    setGroupPatientIds(patientIds);

    // update status
    setGroupStatus(_statusComplete);
    setEndpointStatus(_statusAvailable);

		// if there was a clean-up performed, reset the data (no longer clean)
		if ((cleanUpData) && (cleanUpData.length > 0)) {
			setCleanUpStatus(_statusAvailable);
			setCleanUpData([]);
		}
	}

	/** Callback function to process ClientHost messages */
	function handleHostMessage(message: string) {
		let notificationReturn:NotificationReturn = NotificationHelper.ParseNotificationMessage(
			props.useBackportToR4,
			message
		);

		if (!notificationReturn.success) {
			// ignore
			return;
		}

		// special handling for handshake
		if (notificationReturn.notificationType === fhirCommon.SubscriptionNotificationTypeCodes.HANDSHAKE) {
			let data: SingleRequestData = {
				name: 'Handshake',
				id: 'handshake',
				responseData: JSON.stringify(notificationReturn.bundle, null, 2),
				responseDataType: RenderDataAsTypes.FHIR,
				info: `Handshake:\n`+
					`\tSubscriptionTopic: ${notificationReturn.topicUrl}\n` +
					`\tSubscription:      ${notificationReturn.subscription}\n` +
					`\tStatus:            ${notificationReturn.status}`,
			}

			setHandshakeData([data]);
			setHandshakeStatus(_statusComplete);

			let supported:boolean|undefined = props.useBackportToR4 ? props.fhirServerInfoR4.supportsCreateEncounter : props.fhirServerInfoR5.supportsCreateEncounter;

			// check for NOT being allowed to trigger on this server
			if (!supported) {
				setTriggerCount(100000);
				setNotificationStatus(_statusBusy);
			}
			
			setTriggerStatus(_statusAvailable);

			return;
		}

		let rec:SingleRequestData = {
			id:`event_${notificationData.length}`, 
			name: `Notification #${notificationData.length}`,
			responseData: JSON.stringify(notificationReturn.bundle, null, 2),
			responseDataType: RenderDataAsTypes.FHIR,
			info: `Notification #${notificationData.length}:\n`+
				`\tSubscription:      ${notificationReturn.subscription}\n` +
				`\tSubscriptionTopic: ${notificationReturn.topicUrl}\n` +
				`\tType:              ${notificationReturn.notificationType}\n` +
				`\tStatus:            ${notificationReturn.status}\n` +
				`\tBundle Events:     ${notificationReturn.eventsInNotification}\n`+
				`\tTotal Events:      ${notificationReturn.eventsSinceSubscriptionStart}`,
		}

		let data: SingleRequestData[] = notificationData.slice();
		data.push(rec);

		let pendingNotifications = triggerCount - notificationReturn.eventsInNotification;

		setTriggerCount(pendingNotifications);
		setNotificationData(data);

		if (pendingNotifications > 0) {
			setNotificationStatus(_statusBusy);
		} else {
			setNotificationStatus(_statusComplete);
		}
	}

	// if we are connected, render scenario content
	return (
	<div id='mainContent'>
		<Card key='title' elevation={Elevation.TWO} style={{margin: 5}}>
			<Text>
				<H3>Scenario 2 - (<a 
					href='https://github.com/argonautproject/subscriptions/tree/master/connectathon-scenarios-202005#scenario-2' 
					target='_blank'
					rel="noopener noreferrer"
					>Docs</a>)</H3>
				Group member Patient Encounter notifications via REST-Hook (e.g., to an interested party)
			</Text>
		</Card>

		{/* Get Topic list from FHIR Server */}
		<TopicS2
			key='s2_topic'
			paneProps={props}
			status={topicStatus}
			updateStatus={setTopicStatus}
			data={topicData}
			setData={setTopicData}
			setTopic={setSelectedTopic}
			/>

		{/* Select or Create Group */}
		<GroupS2
			key='s2_group'
			paneProps={props}
			registerSelectedGroupId={registerSelectedGroupId}
			status={groupStatus}
			updateStatus={setGroupStatus}
			data={groupData}
			setData={setGroupData}
			/>

		{/* Ask Client Host to create Endpoint */}
		<EndpointS2
			key='s2_endpoint'
			paneProps={props}
			registerEndpoint={registerEndpoint}
			status={endpointStatus}
			updateStatus={setEndpointStatus}
			data={endpointData}
			setData={setEndpointData}
			/>

		{/* Request Subscription on FHIR Server */}
		<SubscriptionS2
			key='s2_subscription'
			paneProps={props}
			registerSubscription={registerSubscription}
			status={subscriptionStatus}
			updateStatus={setSubscriptionStatus}
			data={subscriptionData}
			setData={setSubscriptionData}
			selectedGroupId={selectedGroupId!}
			topic={selectedTopic}
			subscription={subscription!}
			endpoint={endpoint!}
			/>
		
		{/* Wait on Endpoint handshake */}
		<HandshakeS2
			key='s2_handshake'
			paneProps={props}
			status={handshakeStatus}
			data={handshakeData}
			/>

		{/* Send an Encounter to trigger an event */}
		<TriggerS2
			key='s2_trigger'
			paneProps={props}
			registerEncounterSent={registerEncounterSent}
			status={triggerStatus}
			updateStatus={setTriggerStatus}
			data={triggerData}
			setData={setTriggerData}
			groupPatientIds={groupPatientIds}
			/>

		{/* Wait on Subscription Notification */}
		<NotificationS2
			key='s2_notification'
			paneProps={props}
			status={notificationStatus}
			data={notificationData}
			/>

		{/* Clean up */}
		<CleanUpS2
			key='s1_cleanup'
			paneProps={props}
			cleanUp={cleanUp}
			status={cleanUpStatus}
			data={cleanUpData}
			/>
	</div>
	);
}
