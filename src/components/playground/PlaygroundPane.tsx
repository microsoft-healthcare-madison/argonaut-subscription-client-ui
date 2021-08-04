import React, {useState, useEffect} from 'react';

import {
  Card,
  Elevation, NonIdealState, H3, Text,
} from '@blueprintjs/core';

import * as fhir4 from '../../models/fhir_r4';
import * as fhir5 from '../../models/fhir_r5';
import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../../models/ContentPaneProps';
import TopicPlayground from './TopicPlayground';
import { DataCardStatus } from '../../models/DataCardStatus';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import NotificationPlayground from './NotificationPlayground';
import SubscriptionPlayground from './SubscriptionPlayground';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import EndpointPlayground from './EndpointPlayground';
import WebsocketPlayground from './WebsocketPlayground';
import { ApiResponse, ApiHelper } from '../../util/ApiHelper';
// import { KeySelectionInfo } from '../../models/KeySelectionInfo';
import EncountersPlayground from './EncountersPlayground';
import { NotificationHelper, NotificationReturn } from '../../util/NotificationHelper';

export default function PlaygroundPane(props: ContentPaneProps) {

	const _statusAvailable: DataCardStatus = {available: true, complete: false, busy: false};
	// const _statusNotAvailable: DataCardStatus = {available: false, complete: false, busy: false};
	const _statusBusy: DataCardStatus = {available: true, complete: false, busy: true};
	const _statusComplete: DataCardStatus = {available: true, complete: true, busy: false};

	const [connected, setConnected] = useState<boolean>(true);

	const [notificationData, setNotificationData] = useState<SingleRequestData[]>([]);
	const [notificationStatus, setNotificationStatus] = useState<DataCardStatus>(_statusAvailable);

	const [topicData, setTopicData] = useState<SingleRequestData[]>([]);
	const [topicStatus, setTopicStatus] = useState<DataCardStatus>(_statusAvailable);
	const [topics, setTopics] = useState<fhir4.SubscriptionTopic[]|fhir5.SubscriptionTopic[]>([]);

	const [endpointData, setEndpointData] = useState<SingleRequestData[]>([]);
	const [endpointStatus, setEndpointStatus] = useState<DataCardStatus>(_statusAvailable);
	const [endpoints, setEndpoints] = useState<EndpointRegistration[]>([]);

	const [subscriptionData, setSubscriptionData] = useState<SingleRequestData[]>([]);
	const [subscriptionStatus, setSubscriptionStatus] = useState<DataCardStatus>(_statusAvailable);
	const [subscriptions, setSubscriptions] = useState<fhir5.Subscription[]>([]);

	const [encounterData, setEncounterData] = useState<SingleRequestData[]>([]);
	const [encounterStatus, setEncounterStatus] = useState<DataCardStatus>(_statusAvailable);
	const [patientIds, setPatientIds] = useState<string[]>([]);

	const [websocketData, setWebsocketData] = useState<SingleRequestData[]>([]);
	const [websocketStatus, setWebsocketStatus] = useState<DataCardStatus>(_statusAvailable);

	const [pendingMessages, setPendingMessages] = useState<string[]>([]);

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

	useEffect(() => {
		if (pendingMessages.length === 0) {
			return;
		}

		handleHostMessage(pendingMessages[0]);
		let updated:string[] = pendingMessages.slice(1);
		setPendingMessages(updated);
	}, [pendingMessages, setPendingMessages, handleHostMessage]);

	function queueMessage(message:string) {
		let updated:string[] = pendingMessages.slice();
		updated.push(message);
		setPendingMessages(updated);
	}


	// check for not being connected
	if (!connected) {
	return(
		<div id='mainContent'>
			<Card elevation={Elevation.TWO}>
				<NonIdealState
					icon={IconNames.ISSUE}
					title='Not Connected'
					description='You must be connected to a FHIR Server and Client Host before using the playground.'
					/>
			</Card>
		</div>
		);
	}

	/** Callback function to process ClientHost messages */
	function handleHostMessage(message: string) {
		// check for an R4-Websocket ping
		if (message.startsWith('ping')) {
			let rec:SingleRequestData = {
				id:`event_${notificationData.length}`, 
				name: `Notification #${notificationData.length}`,
				responseData: message,
				responseDataType: RenderDataAsTypes.Text,
				info: `Notification #${notificationData.length}:\n`+
					`\t${message}`,
			}

			let data: SingleRequestData[] = notificationData.slice();
			data.push(rec);
			setNotificationData(data);

			return;
		}

		// attempt to parse into a bundle
		let notificationReturn:NotificationReturn = NotificationHelper.ParseNotificationMessage(
			props.useBackportToR4,
			message);

		if (!notificationReturn.success) {
			console.log('Parsing notification failed', message);
			// ignore
			return;
		}

		let additional:SingleRequestData = {
			id:`event_${notificationData.length}`, 
			name: `Notification #${notificationData.length}`,
			responseData: JSON.stringify(notificationReturn.bundle, null, 2),
			responseDataType: RenderDataAsTypes.FHIR,
			info: `Notification #${notificationData.length}:\n`+
				`\tSubscription:           ${notificationReturn.subscription}\n` +
				`\tSubscriptionTopic:      ${notificationReturn.topicUrl}\n` +
				`\tType:                   ${notificationReturn.notificationType}\n` +
				`\tStatus:                 ${notificationReturn.status}\n` +
				`\tBundle Events:          ${notificationReturn.eventsInNotification}\n`+
				`\tTotal Events:           ${notificationReturn.eventsSinceSubscriptionStart}\n` +
				`\tEntries with URLs:      ${notificationReturn.entriesWithFullUrl}\n` +
				`\tEntries with resources: ${notificationReturn.entriesWithResource}\n`,
		}

		let updated: SingleRequestData[] = notificationData.slice();
		updated.push(additional);

		setNotificationData(updated);
	}

	/** Register a subscription as active in this scenario */
	function registerSubscription(value: fhir5.Subscription) {
		let values: fhir5.Subscription[] = subscriptions.slice();
		values.push(value);

		// save subscription
		setSubscriptions(values);

		// update status
		setSubscriptionStatus(_statusComplete);
		setNotificationStatus(_statusBusy);
	}

	function registerPatientId(value: string) {
		if (!(value in patientIds)) {
			let ids = patientIds.slice();
			ids.push(value);
			setPatientIds(ids);
		}
	}

	async function registerGroupId(value: string) {
		// get the id's for this group
		let groupPatientIds: string[] = await getGroupPatientIds(value);

		let idsToAdd:string[] = [];

		// add each patient ID as necessary
		groupPatientIds.forEach((id) => {
			if (!(id in patientIds)) {
				idsToAdd.push(id);
			}
		});

		if (idsToAdd.length !== 0) {
			let ids = patientIds.slice();
			ids.push(...idsToAdd);
			setPatientIds(ids);
		}
	}

	async function getGroupPatientIds(groupId: string):Promise<string[]> {
    // construct the search url
		var url: string = new URL(
			groupId, 
			props.useBackportToR4 ? props.fhirServerInfoR4.url : props.fhirServerInfoR5.url).toString();

    try {
      let response:ApiResponse<fhir5.Group> = await ApiHelper.apiGetFhir<fhir5.Group>(
        url,
        props.useBackportToR4 ? props.fhirServerInfoR4.authHeaderContent : props.fhirServerInfoR5.authHeaderContent);

      // check for no values
      if (!response.value) {
        return [];
			}
			
			const group:fhir5.Group = response.value! as fhir5.Group;

			if (!group.actual) return [];

			//let memberCount = group.quantity ? group.quantity : (group.member ? group.member!.length : 0);
			let ids: string[] = [];

			if (group.member) {
				group.member!.forEach((member: fhir5.GroupMember) => {
					if ((member.entity) && (member.entity.reference)) {
						ids.push(member.entity.reference);
					}
				})
			}
			
			return ids;
		} catch (err) {
			return [];
		}
	}

	// if we are connected, render scenario content
	return (
		<div id='mainContent'>
			<Card key='title' elevation={Elevation.TWO} style={{margin: 5}}>
				<Text>
					<H3>Playground</H3>
					Area to manually test various functions and operations.
				</Text>
				</Card>

			{/* Subscription Notification Card */}
			<NotificationPlayground
				key='playground_notification'
				paneProps={props}
				status={notificationStatus}
				data={notificationData}
				/>

			{/* Topic Playground Card */}
			<TopicPlayground
				key='playground_topic'
				paneProps={props}
				status={topicStatus}
				updateStatus={setTopicStatus}
				data={topicData}
				setData={setTopicData}
				setTopics={setTopics}
				/>

			{/* Endpoint Playground Card */}
			<EndpointPlayground
				key='playground_endpoint'
				paneProps={props}
				status={endpointStatus}
				updateStatus={setEndpointStatus}
				data={endpointData}
				setData={setEndpointData}
				endpoints={endpoints}
				setEndpoints={setEndpoints}
				/>

			{/* Subscription Playground Card */}
			<SubscriptionPlayground
				key='playground_subscription'
				paneProps={props}
				registerSubscription={registerSubscription}
				status={subscriptionStatus}
				updateStatus={setSubscriptionStatus}
				data={subscriptionData}
				setData={setSubscriptionData}
				selectedPatientId={''}
				endpoints={endpoints}
				topics={topics}
				subscriptions={subscriptions}
				registerPatientId={registerPatientId}
				registerGroupId={registerGroupId}
				/>

			<WebsocketPlayground
				key='playground_websocket'
				paneProps={props}
				status={websocketStatus}
				updateStatus={setWebsocketStatus}
				data={websocketData}
				setData={setWebsocketData}
				subscriptions={subscriptions}
				handleHostMessage={queueMessage}
				/>

			<EncountersPlayground
				key='playground_encounters'
				paneProps={props}
				status={encounterStatus}
				updateStatus={setEncounterStatus}
				data={encounterData}
				setData={setEncounterData}
				patientIds={patientIds}
				/>
		</div>
	);


}