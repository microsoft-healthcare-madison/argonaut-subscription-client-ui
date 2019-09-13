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
				if (element.url.endsWith('subscriptionEventCount')) {
					eventCount = element.valueUnsignedInt!;
				} else if (element.url.endsWith('bundleEventCount')) {
					bundleEventCount = element.valueUnsignedInt!;
				} else if (element.url.endsWith('subscriptionStatus')) {
					status = element.valueString!;
				} else if (element.url.endsWith('subscriptionTopicUrl')) {
					topicUrl = element.valueString!;
				} else if (element.url.endsWith('subscriptionUrl')) {
					subscriptionUrl = element.valueString!;
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
				/>
		</div>
	);


}