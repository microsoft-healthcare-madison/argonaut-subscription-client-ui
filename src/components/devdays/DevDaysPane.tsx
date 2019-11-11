import React, {useState, useEffect} from 'react';

import {
  Card,
  Elevation, NonIdealState, H3, Text,
} from '@blueprintjs/core';

import * as fhir from '../../models/fhir_r4_selected';
import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardStatus } from '../../models/DataCardStatus';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import { ApiResponse, ApiHelper } from '../../util/ApiHelper';
import { KeySelectionInfo } from '../../models/KeySelectionInfo';
import NotificationDevDays from './NotificationDevDays';
import EndpointDevDays from './EndpointDevDays';

export default function DevDaysPane(props: ContentPaneProps) {

	const _statusAvailable: DataCardStatus = {available: true, complete: false, busy: false};
	// const _statusNotAvailable: DataCardStatus = {available: false, complete: false, busy: false};
	const _statusBusy: DataCardStatus = {available: true, complete: false, busy: true};
	const _statusComplete: DataCardStatus = {available: true, complete: true, busy: false};

	const [connected, setConnected] = useState<boolean>(true);

	const [notificationData, setNotificationData] = useState<SingleRequestData[]>([]);
	const [notificationStatus, setNotificationStatus] = useState<DataCardStatus>(_statusAvailable);

	const [endpointData, setEndpointData] = useState<SingleRequestData[]>([]);
	const [endpointStatus, setEndpointStatus] = useState<DataCardStatus>(_statusAvailable);
	const [endpoints, setEndpoints] = useState<EndpointRegistration[]>([]);

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
					description='You must be connected to a FHIR Server and Client Host before continuing.'
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
					eventCount = element.valueDecimal!;
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
			<NotificationDevDays
				key='devdays_notification'
				paneProps={props}
				status={notificationStatus}
				data={notificationData}
				/>

			{/* Endpoint Playground Card */}
			<EndpointDevDays
				key='devdays_endpoint'
				paneProps={props}
				status={endpointStatus}
				updateStatus={setEndpointStatus}
				data={endpointData}
				setData={setEndpointData}
				endpoints={endpoints}
				setEndpoints={setEndpoints}
				/>

		</div>
	);


}