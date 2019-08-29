import * as React from 'react';

import {
  Card,
	Button,
  FormGroup,
  Elevation,
  Text,
  H3, NonIdealState, HTMLSelect,
} from '@blueprintjs/core';

import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { ScenarioStep } from '../ScenarioStep';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import { ApiHelper } from '../../util/ApiHelper';
import * as fhir from '../../models/fhir_r4_selected';
import { ScenarioStepData } from '../../models/ScenarioStepData';
import S1_Topic from './S1_Topic';
import S1_Patient from './S1_Patient';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import { DataCardStatus } from '../../models/DataCardStatus';
import S1_Endpoint from './S1_Endpoint';
import S1_Subscription from './S1_Subscription';
import S1_Handshake from './S1_Handshake';
import S1_Trigger from './S1_Trigger';
import S1_Notification from './S1_Notification';

/** Type definition for the current object's state variable */
interface ComponentState {
	topicData: SingleRequestData[],
	topicStatus: DataCardStatus,
	patientData: SingleRequestData[],
	patientStatus: DataCardStatus,
	selectedPatientId: string,
	endpointData: SingleRequestData[],
	endpointStatus: DataCardStatus,
	endpoint: EndpointRegistration | null,
	subscriptionData: SingleRequestData[],
	subscriptionStatus: DataCardStatus,
	subscription: fhir.Subscription | null,
	handshakeData: SingleRequestData[],
	handshakeStatus: DataCardStatus,
	triggerData: SingleRequestData[],
	triggerStatus: DataCardStatus,
	triggerCount: number,
	notificationData: SingleRequestData[],
	notificationStatus: DataCardStatus,

	step08: DataCardInfo,
	stepData08: ScenarioStepData[],
	connected: boolean,

	step06EncounterClass: string,
	step06EncounterStatus: string,
}

/**
 * Walks a user through the steps of Scenario 1
 */
export class Scenario1Pane extends React.PureComponent<ContentPaneProps> {
  public state: ComponentState = {
		topicData: [],
		topicStatus: {available: true, complete: false, busy: false},
		patientData: [],
		patientStatus: {available: true, complete: false, busy: false},
		selectedPatientId: '',
		endpointData: [],
		endpointStatus: {available: false, complete: false, busy: false},
		endpoint: null,
		subscriptionData: [],
		subscriptionStatus: {available: false, complete: false, busy: false},
		subscription: null,
		handshakeData: [],
		handshakeStatus: {available: false, complete: false, busy: false},
		triggerData: [],
		triggerStatus: {available: false, complete: false, busy: false},
		triggerCount: 0,
		notificationData: [],
		notificationStatus: {available: false, complete: false, busy: false},

		step08: {
			id: 'S1_cleanUp',
			stepNumber: 8,
			heading: 'Clean up',
			description: 'Delete Subscription, Destroy Endpoint, etc.',
			optional: true,
			available: true,
			completed: false,
			busy: false,
		},
		stepData08: [],
		connected: true,
		step06EncounterClass: 'VR',
		step06EncounterStatus: 'in-progress',
	};


	constructor(props: ContentPaneProps) {
		super(props);

		// **** check if we are connected to show the proper UI ***

		this.checkIfConnected(props, false);

		// **** register our callback handler ****

		props.registerHostMessageHandler(this.handleHostMessage);

	}

	componentDidMount() {
		// **** check if we are connected to show the proper UI ***

		this.checkIfConnected(this.props, true);

		// **** register our callback handler ****

		this.props.registerHostMessageHandler(this.handleHostMessage);
	}

  public render() {

		// **** if we are not connected, render a NonIdealState warning and nothing else ****

		if (!this.state.connected) {
			return (
				<Card elevation={Elevation.TWO}>
					<NonIdealState
						icon={IconNames.ISSUE}
						title='Not Connected to Client Host'
						description='You must be connected to a FHIR Server and Client Host before running this scenario.'
						/>
				</Card>
			);
		}

		// **** if we are connected, render scenario content ****
    return ( [
			<Card key='title' elevation={Elevation.TWO} style={{margin: 5}}>
				<Text>
					<H3>Scenario 1 - (<a 
						href='http://bit.ly/argo-sub-connectathon-2019-09#scenario-1' 
						target='_blank'
						rel="noopener noreferrer"
						>Docs</a>)</H3>
					Single-Patient Encounter notifications via REST-Hook (e.g., to a consumer app)
				</Text>
			</Card>,

			/* Get Topic list from FHIR Server */
			<S1_Topic
				key='s1_topic'
				paneProps={this.props}
				status={this.state.topicStatus}
				updateStatus={this.updateStatus}
				data={this.state.topicData}
				setData={this.setData}
				/>,

				
			/* Select or Create Patient */
			<S1_Patient
				key='s1_patient'
				paneProps={this.props}
				registerSelectedPatientId={this.registerSelectedPatientId}
				status={this.state.patientStatus}
				updateStatus={this.updateStatus}
				data={this.state.patientData}
				setData={this.setData}
				/>,

			/* Ask Client Host to create Endpoint */
			<S1_Endpoint
				key='s1_endpoint'
				paneProps={this.props}
				registerEndpoint={this.registerEndpoint}
				status={this.state.endpointStatus}
				updateStatus={this.updateStatus}
				data={this.state.endpointData}
				setData={this.setData}
				/>,

			/* Request Subscription on FHIR Server */
			<S1_Subscription
				key='s1_subscription'
				paneProps={this.props}
				registerSubscription={this.registerSubscription}
				status={this.state.subscriptionStatus}
				updateStatus={this.updateStatus}
				data={this.state.subscriptionData}
				setData={this.setData}
				selectedPatientId={this.state.selectedPatientId!}
				endpoint={this.state.endpoint!}
				/>,
			
			/* Wait on Endpoint handshake */
			<S1_Handshake
				key='s1_handshake'
				paneProps={this.props}
				status={this.state.handshakeStatus}
				data={this.state.handshakeData}
				/>,

			/* Send an Encounter to trigger an event */
			<S1_Trigger
				key='s1_trigger'
				paneProps={this.props}
				registerEncounterSent={this.registerEncounterSent}
				status={this.state.triggerStatus}
				updateStatus={this.updateStatus}
				data={this.state.triggerData}
				setData={this.setData}
				selectedPatientId={this.state.selectedPatientId!}
				/>,

			/* Wait on Subscription Notification */
			<S1_Notification
				key='s1_notification'
				paneProps={this.props}
				status={this.state.notificationStatus}
				data={this.state.notificationData}
				/>,

			/* Clean up */
			<ScenarioStep 
				key='step08'
				step={this.state.step08} 
				data={this.state.stepData08} 
				paneProps={this.props}
				>
				<Button
					disabled={!this.state.step08.available}
					onClick={this.handleCleanUpClick}
					>
					Go
				</Button>
			</ScenarioStep>,
		]
    );
	}

	private updateStatus = (step: number, status: DataCardStatus) => {
		switch (step)
		{
			case 1:
				this.setState({topicStatus: status});
				break;
			case 2:
				this.setState({patientStatus: status});
				break;
			case 3:
				this.setState({endpointStatus: status});
				break;
			case 4:
				this.setState({subscriptionStatus: status});
				break;
			case 5:
				this.setState({handshakeStatus: status});
				break;
			case 6:
				this.setState({triggerStatus: status});
				break;
			case 7:
				this.setState({notificationStatus: status});
				break;
		}
	}

	private setData = (step: number, data: SingleRequestData[]) => {
		switch (step)
		{
			case 1:
				this.setState({topicData: data});
				break;
			case 2:
				this.setState({patientData: data});
				break;
			case 3:
				this.setState({endpointData: data});
				break;
			case 4:
				this.setState({subscriptionData: data});
				break;
			case 5:
				this.setState({handshakeData: data});
				break;
			case 6:
				this.setState({triggerData: data});
				break;
			case 7:
				this.setState({notificationData: data});
				break;
		}
	}

	private registerEncounterSent = () => {
		let updated: number = this.state.triggerCount + 1;
		
		// **** build updated state ****

		let current: DataCardStatus = {...this.state.triggerStatus, available: true, complete: true, busy: false};
		let next: DataCardStatus = {...this.state.notificationStatus, available: true, complete: false, busy: true};

		this.setState({
			triggerCount: updated,
			triggerStatus: current,
			notificationStatus: next,
		});
	}

	private registerSubscription = (subscription: fhir.Subscription) => {
		// **** disable subsequent steps ****

		this.disableSteps(5);

		// **** check for an old subscription ****

		if (this.state.subscription) {
			ApiHelper.deleteSubscription(
				this.state.subscription.id!,
				this.props.fhirServerInfo.url
			);
		}

		// **** build updated state ****

		let current: DataCardStatus = {...this.state.subscriptionStatus, available: true, complete: true, busy: false};
		let next: DataCardStatus = {...this.state.handshakeStatus, available: true, complete: false, busy: true};

		this.setState({
			subscription: subscription, 
			subscriptionStatus: current,
			handshakeStatus: next,
		});
	}

	private registerEndpoint = (endpoint: EndpointRegistration) => {
		// **** disable subsequent steps ****

		this.disableSteps(4);

		// **** check for an old endpoint ****

		if (this.state.endpoint) {
			ApiHelper.deleteEndpoint(
				this.props.clientHostInfo.registration,
				this.state.endpoint.uid!,
				this.props.clientHostInfo.url
				);
		}

		// **** build updated state ****

		let current: DataCardStatus = {...this.state.endpointStatus, available: true, complete: true, busy: false};
		let next: DataCardStatus = {...this.state.subscriptionStatus, available: true, complete: false, busy: false};

		this.setState({
			endpoint: endpoint, 
			endpointStatus: current,
			subscriptionStatus: next,
		});
	}

	private registerSelectedPatientId = (id: string) => {
		// **** disable subsequent steps ****

		this.disableSteps(3);

		// **** build our updated state ****

		let current: DataCardStatus = {...this.state.patientStatus, available: true, complete: true, busy: false};
		let next: DataCardStatus = {...this.state.endpointStatus, available: true, complete: false, busy: false};

		this.setState({
			selectedPatientId: id, 
			patientStatus: current,
			endpointStatus: next,
		});
	}

	/** Callback function to process ClientHost messages */
	private handleHostMessage = (message: string) => {
		// **** vars we want ****

		let eventCount: number = NaN;
		let bundleEventCount: number = NaN;
		let status: string;
		let topicUrl: string;
		let subscriptionUrl: string;

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

		// **** check for being a handshake ****

		if (eventCount === 0) {
			// **** update steps ****

			let current: DataCardStatus = {...this.state.handshakeStatus,
				complete: true, 
				busy: false,
			};
			let data: SingleRequestData = {
				name: 'Handshake',
				id: 'handshake',
				responseData: JSON.stringify(bundle, null, 2),
				responseDataType: RenderDataAsTypes.FHIR
			}

			let next: DataCardStatus = {...this.state.triggerStatus, available: true};

			// **** update our state ****

			this.setState({
				handshakeStatus: current, 
				handshakeData: [data],
				triggerStatus: next, 
			});
		} else {
			let pendingNotifications = this.state.triggerCount - 1;
			console.log('Received notification, remaining pending:', pendingNotifications);

			// **** update step ****

			let current: DataCardStatus = {...this.state.notificationStatus,
				complete: true, 
				busy: (pendingNotifications > 0),
			};

			let rec:SingleRequestData = {
				id:`event_${this.state.notificationData.length}`, 
				name: `Notification #${this.state.notificationData.length}`, 	// title: `# ${this.state.stepData07.length}`
				responseData: JSON.stringify(bundle, null, 2),
				responseDataType: RenderDataAsTypes.FHIR
			}

			let data: SingleRequestData[] = this.state.notificationData.slice();
			data.push(rec);

			// **** update our state ****

			this.setState({
				notificationStatus: current, 
				notificationData: data, 
				triggerCount: pendingNotifications
			});
		}
	}

	/** Handle user clicks on the CleanUp button (delete Subscription from FHIR Server, Endpoint from ClientHost) */
	private handleCleanUpClick = () => {
		// **** reset to step 2 (removes endpoints and subscriptions) ****

		this.disableSteps(2);
	}

	private disableSteps = (startingAt: number) => {
		if (startingAt > 7) {
			return;
		}

		if (startingAt <= 2) {
			this.setState({
				selectedPatientId: '', 
				patientData: [],
				patientStatus: {available: true, complete: false, busy: false},
				});
		}

		if (startingAt <= 3) {
			if (this.state.endpoint) {
				ApiHelper.deleteEndpoint(
					this.props.clientHostInfo.registration, 
					this.state.endpoint.uid!,
					this.props.clientHostInfo.url
					);
			}
			this.setState({
				endpoint: null,
				endpointData: [],
				endpointStatus: {available: false, complete: false, busy: false},
				});
		}

		if (startingAt <= 4) {
			if (this.state.subscription) {
				ApiHelper.deleteSubscription(
					this.state.subscription.id!,
					this.props.fhirServerInfo.url
					);
			}
			this.setState({
				subscription: null,
				subscriptionData: [],
				subscriptionStatus: {available: false, complete: false, busy: false},
			});
		}

		if (startingAt <= 5) {
			this.setState({
				handshakeData: [],
				handshakeStatus: {available: false, complete: false, busy: false},
			});
		}

		if (startingAt <= 6) {
			this.setState({
				triggerData: [],
				triggerStatus: {available: false, complete: false, busy: false},
				triggerCount: 0,
			});
		}

		if (startingAt <= 7) {
			this.setState({
				notificationData: [],
				notificationStatus: {available: false, complete: false, busy: false},
			});
		}
	}

	/** Determine if the client is connected enough to proceed and update state accordingly */
	private checkIfConnected = (nextProps: ContentPaneProps, useSetState: boolean) => {
		let lastState: boolean = this.state.connected;
		var connected: boolean = false;

		// **** check to make sure we are connected to the host (requires server) ****

		if (nextProps.clientHostInfo.status !== 'ok') {
			connected = false;
		} else {
			connected = true;
		}

		// **** update state (if necessary) ****

		if (connected !== lastState) {
			// **** check if we are using setState (cannot be used from constructor) ****

			if (useSetState) {
				this.setState({connected: connected});
			} else {
				this.state.connected = connected;
			}
		}
	}

}
