import React, { useState, useEffect } from 'react';

import {
  Card,
  Elevation,
  Text,
  H3, NonIdealState,
} from '@blueprintjs/core';

import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { ApiHelper } from '../../util/ApiHelper';
import * as fhir4 from 'fhir4';
import * as fhir5 from 'fhir5';
import * as fhirCommon from '../../models/fhirCommon';
import TopicES1 from './TopicES1';
import PatientES1 from './PatientES1';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import { DataCardStatus } from '../../models/DataCardStatus';
import SubscriptionES1 from './SubscriptionES1';
import TriggerES1 from './TriggerES1';
import CleanUpES1 from './CleanUpES1';
import { NotificationHelper, NotificationReturn } from '../../util/NotificationHelper';
import OperationEventsCard from '../common/OperationEventsCard';

/**
 * Walks a user through the steps of Scenario 1
 */
export default function EndpointScenarioPane1(props: ContentPaneProps) {

	const _statusAvailable: DataCardStatus = {available: true, complete: false, busy: false};
	const _statusNotAvailable: DataCardStatus = {available: false, complete: false, busy: false};
	const _statusBusy: DataCardStatus = {available: true, complete: false, busy: true};
	const _statusComplete: DataCardStatus = {available: true, complete: true, busy: false};

	const [connected, setConnected] = useState<boolean>(true);
	
	const [topicData, setTopicData] = useState<SingleRequestData[]>([]);
	const [topicStatus, setTopicStatus] = useState<DataCardStatus>(_statusAvailable);
	const [selectedTopic, setSelectedTopic] = useState<fhir4.SubscriptionTopic|fhir5.SubscriptionTopic|null>(null); 
	
	const [patientData, setPatientData] = useState<SingleRequestData[]>([]);
	const [patientStatus, setPatientStatus] = useState<DataCardStatus>(_statusAvailable);
	const [selectedPatientId, setSelectedPatientId] = useState<string>('');
	
	const [subscriptionData, setSubscriptionData] = useState<SingleRequestData[]>([]);
	const [subscriptionStatus, setSubscriptionStatus] = useState<DataCardStatus>(_statusNotAvailable);
	const [subscription, setSubscription] = useState<fhir5.Subscription | null>(null);

	const [triggerData, setTriggerData] = useState<SingleRequestData[]>([]);
	const [triggerStatus, setTriggerStatus] = useState<DataCardStatus>(_statusNotAvailable);
	const [triggerCount, setTriggerCount] = useState<number>(0);

  const [opEventsData, setOpEventsData] = useState<SingleRequestData[]>([]);
  const [opEventsStatus, setOpEventsStatus] = useState<DataCardStatus>(_statusAvailable);

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
			setSelectedPatientId('');
			setPatientData([]);
			setPatientStatus(_statusAvailable);
		}

		if (startingAt <= 3) {
			if (subscription) {
				ApiHelper.deleteSubscription(
					subscription.id!,
					props.useBackportToR4 ? props.fhirServerInfoR4.url : props.fhirServerInfoR5.url,
					props.useBackportToR4);
			}
			setSubscription(null);
			setSubscriptionData([]);
			setSubscriptionStatus(_statusNotAvailable);

      setOpEventsData([]);
		}

		if (startingAt <= 4) {
			setTriggerCount(0);
			setTriggerData([]);
			setTriggerStatus(_statusNotAvailable);
		}

		if (startingAt <= 5) {
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

			// can trigger now
			setTriggerStatus(_statusAvailable);
			return;
		}

		// save subscription
		setSubscription(value);

		// update status
		setSubscriptionStatus(_statusComplete);
    setTriggerStatus(_statusAvailable);
	}

	/** Register a patient id as active in this scenario */
	function registerSelectedPatientId(id: string) {
		// disable subsequent steps
		disableSteps(3);

		// save patient id
		setSelectedPatientId(id);

		// update status
		setPatientStatus(_statusComplete);
    setSubscriptionStatus(_statusAvailable);

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
	}

	// if we are connected, render scenario content
	return (
	<div id='mainContent'>
		<Card key='title' elevation={Elevation.TWO} style={{margin: 5}}>
			<Text>
				<H3>Scenario 1 - (<a 
					href='https://github.com/argonautproject/subscriptions/tree/master/connectathon-scenarios-202109#scenario-1' 
					target='_blank'
					rel="noopener noreferrer"
					>Docs</a>)</H3>
				Test a REST Endpoint with single-Patient Encounter notifications via REST-Hook (e.g., to a consumer app)
			</Text>
		</Card>

		{/* Get Topic list from FHIR Server */}
		<TopicES1
			key='s1_topic'
			paneProps={props}
			status={topicStatus}
			updateStatus={setTopicStatus}
			data={topicData}
			setData={setTopicData}
			setTopic={setSelectedTopic}
			/>

		{/* Select or Create Patient */}
		<PatientES1
			key='s1_patient'
			paneProps={props}
      selectedPatientId={selectedPatientId}
			registerSelectedPatientId={registerSelectedPatientId}
			status={patientStatus}
			updateStatus={setPatientStatus}
			data={patientData}
			setData={setPatientData}
			/>

		{/* Request Subscription on FHIR Server */}
		<SubscriptionES1
			key='s1_subscription'
			paneProps={props}
			registerSubscription={registerSubscription}
			status={subscriptionStatus}
			updateStatus={setSubscriptionStatus}
			data={subscriptionData}
			setData={setSubscriptionData}
			selectedPatientId={selectedPatientId!}
			registerSelectedPatientId={registerSelectedPatientId}
			topic={selectedTopic}
			subscription={subscription!}
			/>
		
		{/* Send an Encounter to trigger an event */}
		<TriggerES1
			key='s1_trigger'
			paneProps={props}
			registerEncounterSent={registerEncounterSent}
			status={triggerStatus}
			updateStatus={setTriggerStatus}
			data={triggerData}
			setData={setTriggerData}
			selectedPatientId={selectedPatientId!}
			/>

		{/* Query for events */}
		<OperationEventsCard
			key='s1_operation_events'
			paneProps={props}
			status={opEventsStatus}
      updateStatus={setOpEventsStatus}
			data={opEventsData}
      setData={setOpEventsData}
      subscription={subscription}
			/>

		{/* Clean up */}
		<CleanUpES1
			key='s1_cleanup'
			paneProps={props}
			cleanUp={cleanUp}
			status={cleanUpStatus}
			data={cleanUpData}
			/>
	</div>
	);
}
