import React, {useState, useEffect} from 'react';

import {
  Card,
  Elevation, NonIdealState, H3, Text,
} from '@blueprintjs/core';

import * as fhir from '../../models/fhir_r4_selected';
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
import { KeySelectionInfo } from '../../models/KeySelectionInfo';
import EncountersPlayground from './EncountersPlayground';

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
	const [topics, setTopics] = useState<fhir.Topic[]>([]);

	const [endpointData, setEndpointData] = useState<SingleRequestData[]>([]);
	const [endpointStatus, setEndpointStatus] = useState<DataCardStatus>(_statusAvailable);
	const [endpoints, setEndpoints] = useState<EndpointRegistration[]>([]);

	const [subscriptionData, setSubscriptionData] = useState<SingleRequestData[]>([]);
	const [subscriptionStatus, setSubscriptionStatus] = useState<DataCardStatus>(_statusAvailable);
	const [subscriptions, setSubscriptions] = useState<fhir.Subscription[]>([]);

	const [encounterData, setEncounterData] = useState<SingleRequestData[]>([]);
	const [encounterStatus, setEncounterStatus] = useState<DataCardStatus>(_statusAvailable);
	const [patientIds, setPatientIds] = useState<string[]>([]);

	const [websocketData, setWebsocketData] = useState<SingleRequestData[]>([]);
	const [websocketStatus, setWebsocketStatus] = useState<DataCardStatus>(_statusAvailable);

	useEffect(() => {
		/** Determine if the client is connected enough to proceed and update state accordingly */
		function checkIfConnected() {
			let lastState: boolean = connected;
			let nextState: boolean;

			// **** check to make sure we are connected to the host (requires server) ****

			if (props.clientHostInfo.status !== 'ok') {
				nextState = false;
			} else {
				nextState = true;
			}

			// **** update state (if necessary) ****

			if (lastState !== nextState) {
				setConnected(nextState);
			}
		}

		checkIfConnected();

		props.registerHostMessageHandler(handleHostMessage);
	});

	// **** check for not being connected ****

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
		// **** vars we want ****

		let eventCount: number = NaN;
		let bundleEventCount: number = NaN;
		let status: string = '';
		let topicUrl: string = '' ;
		let subscriptionUrl: string = '';

		let bundle: fhir.Bundle;

		// **** check for a ping ****

		if (message.startsWith('ping')) {
			// **** add to our display ****

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

			// **** update our state ****

			setNotificationData(data);

			return;
		}

		// **** resolve this message into a bundle ****

		try {
			bundle = JSON.parse(message);
		} catch(error) {
			// **** assume non-bundle message got through ****
			return;
		}

		// **** check for the extensions we need ****

		if ((bundle) &&
				(bundle.meta) &&
				(bundle.meta.extension))
		{
			bundle.meta.extension.forEach(element => {
				if (element.url.endsWith('subscriptionEventCount') ||
						element.url.endsWith('subscription-event-count')) {
					eventCount = element.valueUnsignedInt!;
				} else if (element.url.endsWith('bundleEventCount') ||
									 element.url.endsWith('bundle-event-count')) {
					bundleEventCount = element.valueUnsignedInt!;
				} else if (element.url.endsWith('subscriptionStatus') ||
									 element.url.endsWith('subscription-status')) {
					status = element.valueString!;
				} else if (element.url.endsWith('subscriptionTopicUrl') ||
									 element.url.endsWith('subscription-topic-url')) {
					topicUrl = element.valueUrl!;
				} else if (element.url.endsWith('subscriptionUrl') ||
									 element.url.endsWith('subscription-url')) {
					subscriptionUrl = element.valueUrl!;
				}
			});
		}

		// **** add to our display ****

		let rec:SingleRequestData = {
			id:`event_${notificationData.length}`, 
			name: `Notification #${notificationData.length}`,
			responseData: JSON.stringify(bundle, null, 2),
			responseDataType: RenderDataAsTypes.FHIR,
			info: `${(eventCount === 0) ? 'Handshake' : 'Notification'} #${notificationData.length}:\n`+
				`\tTopic:         ${topicUrl}\n` +
				`\tSubscription:  ${subscriptionUrl}\n` +
				`\tStatus:        ${status}\n` +
				`\tBundle Events: ${bundleEventCount}\n`+
				`\tTotal Events:  ${eventCount}`,
		}

		let data: SingleRequestData[] = notificationData.slice();
		data.push(rec);

		// **** update our state ****

		setNotificationData(data);
	}

	/** Register a subscription as active in this scenario */
	function registerSubscription(value: fhir.Subscription) {
		let values: fhir.Subscription[] = subscriptions.slice();
		values.push(value);

		// **** save subscription ****

		setSubscriptions(values);

		// **** update status ***

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
		// **** get the id's for this group ****

		let groupPatientIds: string[] = await getGroupPatientIds(value);

		let idsToAdd:string[] = [];
		// **** add each patient ID as necessary ****

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
    // **** construct the search url ****

		var url: string = new URL(groupId, props.fhirServerInfo.url).toString();

    try {
      let response:ApiResponse<fhir.Group> = await ApiHelper.apiGetFhir<fhir.Group>(
        url,
        props.fhirServerInfo.authHeaderContent
      );

      // **** check for no values ****

      if (!response.value) {
        return [];
			}
			
			const group:fhir.Group = response.value! as fhir.Group;

			if (!group.actual) return [];

			let memberCount = group.quantity ? group.quantity : (group.member ? group.member!.length : 0);
			let ids: string[] = [];

			if (group.member) {
				group.member!.forEach((member: fhir.GroupMember) => {
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

	// **** if we are connected, render scenario content ****
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
				handleHostMessage={handleHostMessage}
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