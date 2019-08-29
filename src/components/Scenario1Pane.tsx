import * as React from 'react';

import {
  Card,
	Button,
  FormGroup,
  Elevation,
  Text,
  H3, NonIdealState, HTMLSelect, TabId,
} from '@blueprintjs/core';

import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../models/ContentPaneProps';
import { DataCardInfo } from '../models/DataCardInfo';
import { ScenarioStep } from './ScenarioStep';
import { EndpointRegistration } from '../models/EndpointRegistration';
import { ApiHelper } from '../util/ApiHelper';
import * as fhir from '../models/fhir_r4_selected';
import { PatientSelectionInfo } from '../models/PatientSelectionInfo';
import { ScenarioStepData } from '../models/ScenarioStepData';
import S1_Topic from './S1_Topic';
import S1_Patient from './S1_Patient';
import { SingleRequestData } from '../models/RequestData';
import { DataCardStatus } from '../models/DataCardStatus';
import S1_Endpoint from './S1_Endpoint';

/** Type definition for the current object's state variable */
interface ComponentState {
	topicData: SingleRequestData[],
	topicStatus: DataCardStatus,
	patientData: SingleRequestData[],
	patientStatus: DataCardStatus,
	endpointData: SingleRequestData[],
	endpointStatus: DataCardStatus,
	step04: DataCardInfo,
	stepData04: ScenarioStepData[],
	step05: DataCardInfo,
	stepData05: ScenarioStepData[],
	step06: DataCardInfo,
	stepData06: ScenarioStepData[],
	step07: DataCardInfo,
	stepData07: ScenarioStepData[],
	step08: DataCardInfo,
	stepData08: ScenarioStepData[],
	connected: boolean,
	endpoint: EndpointRegistration | null,
	subscription: fhir.Subscription | null,
	triggerUid: string,
	step02TabId: string,
	step02MatchType: string,
	step02SubBusy: boolean,
	step02SelectedValue: string,
	step02Patients: PatientSelectionInfo[],
	selectedPatientId: string,
	step02SearchFilter: string,
	step02PatientGivenName: string,
	step02PatientFamilyName: string,
	step02PatientId: string,
	step02Gender: string,
	step02BirthDate: Date,
	step04Payload: string,
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
		endpointData: [],
		endpointStatus: {available: false, complete: false, busy: false},
		step04: {
			id: 'S1_Subscription',
			stepNumber: 4,
			heading: 'Request Subscription on FHIR Server',
			description: '',
			optional: false,
			available: false,
			completed: false,
			busy: false,
		},
		stepData04: [],
		step05: {
			id: 'S1_Handshake',
			stepNumber: 5,
			heading: 'Wait on Endpoint handshake',
			description: '',
			optional: false,
			available: false,
			completed: false,
			busy: false,
		},
		stepData05: [],
		step06: {
			id: 'S1_RequestTrigger',
			stepNumber: 6,
			heading: 'Ask Client Host to trigger event',
			description: '',
			optional: false,
			available: false,
			completed: false,
			busy: false,
		},
		stepData06: [],
		step07: {
			id: 'S1_Notification',
			stepNumber: 7,
			heading: 'Wait on Subscription Notification',
			description: '',
			optional: false,
			available: false,
			completed: false,
			busy: false,
		},
		stepData07: [],
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
		endpoint: null,
		subscription: null,
		triggerUid: '',
		step02TabId: 's2_search',
		step02MatchType: 'name',
		step02SubBusy: false,
		step02SelectedValue: '',
		step02Patients: [],
		selectedPatientId: '',
		step02SearchFilter: '',
		step02PatientFamilyName: '',
		step02PatientGivenName: '',
		step02PatientId: '',
		step02Gender: '',
		step02BirthDate: new Date(),
		step04Payload: 'id-only',
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
			<ScenarioStep 
				key='step04'
				step={this.state.step04} 
				data={this.state.stepData04} 
				paneProps={this.props}
				>
				<HTMLSelect
					onChange={this.handleStep04PayloadChange}
					defaultValue={this.state.step04Payload}
					>
					{ Object.values(fhir.SubscriptionChannelPayloadContentCodes).map((value) => (
						<option key={value}>{value}</option> 
							))}
				</HTMLSelect>
				<Button
					disabled={!this.state.step04.available}
					onClick={this.handleRequestSubscriptionClick}
					>
					Go
				</Button>
			</ScenarioStep>,

			/* Wait on Endpoint handshake */
			<ScenarioStep 
				key='step05'
				step={this.state.step05} 
				data={this.state.stepData05} 
				paneProps={this.props}
				/>,

			/* Ask Client Host to trigger event */
			<ScenarioStep 
				key='step06'
				step={this.state.step06} 
				data={this.state.stepData06} 
				paneProps={this.props}
				>

				<FormGroup
					label='Encounter Class'
					helperText='Class of encounter, per http://terminology.hl7.org/ValueSet/v3-ActEncounterCode'
					labelFor='encounter-class'
					>
					<HTMLSelect
						id='encounter-class'
						onChange={this.handleStep06EncounterClassChange}
						defaultValue={this.state.step06EncounterClass}
						>
						{ Object.values(fhir.v3_ActEncounterCode).map((value) => (
							<option key={value.code} value={value.code}>{value.display}</option> 
								))}
					</HTMLSelect>
				</FormGroup>

				<FormGroup
					label='Encounter Status'
					helperText='Status of encounter, per 	http://hl7.org/fhir/ValueSet/encounter-status'
					labelFor='encounter-status'
					>
					<HTMLSelect
						id='encounter-status'
						onChange={this.handleStep06EncounterStatusChange}
						defaultValue={this.state.step06EncounterStatus}
						>
						<option value='in-progress'>In Progress</option>
					</HTMLSelect>
				</FormGroup>
				
				<Button
					disabled={!this.state.step06.available}
					onClick={this.handleRequestTriggerEventClick}
					>
					Go
				</Button>
			</ScenarioStep>,

			/* Wait on Subscription Notification */
			<ScenarioStep 
				key='step07'
				step={this.state.step07} 
				data={this.state.stepData07} 
				paneProps={this.props}
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
		}
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

		let current: DataCardStatus = {...this.state.endpointStatus, available: true, complete: true};
		let next: DataCardInfo = {...this.state.step04, available: true, completed: false};

		this.setState({
			endpoint: endpoint, 
			endpointStatus: current,
			step04: next,
		});
	}

	private registerSelectedPatientId = (id: string) => {
		// **** disable subsequent steps ****

		this.disableSteps(3);

		// **** build our updated state ****

		let current: DataCardStatus = {...this.state.patientStatus, available: true, complete: true};
		let next: DataCardStatus = {...this.state.endpointStatus, available: true, complete: false};

		this.setState({
			selectedPatientId: id, 
			patientStatus: current,
			endpointStatus: next,
		});
	}

	private handleStep06EncounterClassChange = (event: React.FormEvent<HTMLSelectElement>) => {
		this.setState({step06EncounterClass: event.currentTarget.value})
	}

	private handleStep06EncounterStatusChange = (event: React.FormEvent<HTMLSelectElement>) => {
		this.setState({step06EncounterStatus: event.currentTarget.value})
	}

	private handleStep04PayloadChange = (event: React.FormEvent<HTMLSelectElement>) => {
		this.setState({step04Payload: event.currentTarget.value})
	}

	/** Callback function to process ClientHost messages */
	private handleHostMessage = (message: string) => {
		// **** vars we want ****

		let eventCount: number = NaN;
		let bundleEventCount: number = NaN;
		let status: string;
		let topicUrl: string;
		let subscriptionUrl: string;

		// **** resolve this message into a bundle ****

		let bundle: fhir.Bundle = JSON.parse(message);

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

			let current: DataCardInfo = {...this.state.step05,
				completed: true, 
				busy: false,
			};
			let data: ScenarioStepData[] = [
				{id: 'handshake', title: 'Handshake', data: JSON.stringify(bundle, null, 2), iconName:IconNames.FLAME}
			];

			let next: DataCardInfo = {...this.state.step06, available: true};

			// **** update our state ****

			this.setState({
				step05: current, 
				stepData05: data,
				step06: next, 
			});
		} else {
			// **** update step ****

			let current: DataCardInfo = {...this.state.step07,
				completed: true, 
				busy: false,
			};

			let rec:ScenarioStepData = {
				id:`event_${this.state.stepData07.length}`, 
				title: `Notification`, 								// title: `# ${this.state.stepData07.length}`
				data: JSON.stringify(bundle, null, 2),
				iconName:IconNames.FLAME
			}

			let data: ScenarioStepData[] = this.state.stepData07.slice();
			data.push(rec);

			// **** update our state ****

			this.setState({step07: current, stepData07: data});
		}
	}

	private checkForMatchingTitle = (data: ScenarioStepData[], rec: ScenarioStepData) => {
		for (var i:number = 0; i < data.length; i++) {
			if (data[i].title === rec.title) {
				return i;
			}
		}

		return -1;
	}

	/** Get a FHIR Instant value from a JavaScript Date */
	private getInstantFromDate = (date: Date) => {
		return (JSON.stringify(date).replace(/['"]+/g, ''));
	}
	
	/** Get a FHIR Date String from a JavaScript Date */
	private getFhirDateFromDate = (date: Date) => {
		return (
			date.getFullYear() +
			'-' +
			((date.getMonth() < 9) ? '0' : '') + (date.getMonth()+1) +
			'-' +
			((date.getDate() < 10) ? '0' : '') + date.getDate() 
			)
			;
	}

	/** Handle user clicks on the CreateSubscription button (send request to FHIR server, on success enable next step) */
	private handleRequestSubscriptionClick = () => {
		// **** update step ****

		let busyStep: DataCardInfo = {...this.state.step04, busy: true};

		// **** delete any old subscriptions ****

		if (this.state.subscription) {
			ApiHelper.deleteSubscription(
				this.state.subscription.id!,
				this.props.fhirServerInfo.url
				);
		}

		// **** flag we are asking to create the subscription (busy) ****

		this.setState({step04: busyStep, subscription: null});

		// **** build the url for our call ***

		let url: URL = new URL('Subscription/', this.props.fhirServerInfo.url);
		let endpointUrl: string = new URL(`Endpoints/${this.state.endpoint!.uid!}`, this.props.clientHostInfo.url).toString();
 
		// **** build our subscription channel information ****

		let channel: fhir.SubscriptionChannel = {
			endpoint: endpointUrl,
			header: ['Authorization: Bearer secret-token-abc-123'],
			heartbeatPeriod: 60,
			payload: {content: this.state.step04Payload, contentType: 'application/fhir+json'},
			type: { text: 'rest-hook'},
		}

		// **** build our filter information ****

		let filter: fhir.SubscriptionFilterBy = {
			matchType: '=',
			name: 'patient',
			value: `Patient/${this.state.selectedPatientId}`	//`Patient/${this.state.patientFilter},Patient/K123`
		}

		var expirationTime:Date = new Date();
		expirationTime.setHours(expirationTime.getHours() + 1);

		// **** build the subscription object ****

		let subscription: fhir.Subscription = {
			resourceType: 'Subscription',
			channel: channel,
			filterBy: [filter],
			end: this.getInstantFromDate(expirationTime),
			topic: {reference:  new URL('Topic/admission', this.props.fhirServerInfo.url).toString()},
			reason: 'Client Testing',
			status: 'requested',
		}

		// **** post our request to the server ****

		ApiHelper.apiPost<fhir.Subscription>(url.toString(), JSON.stringify(subscription))
			.then((value: fhir.Subscription) => {
				// **** update steps - note that next step starts busy since we are waiting ****

				let current: DataCardInfo = {...this.state.step04, 
					completed: true, 
					busy: false,
				};

				let data: ScenarioStepData[] = [
					{id:'request', title:'Request', data:JSON.stringify(subscription, null, 2), iconName:IconNames.FLAME},
					{id:'response', title:'Response', data:JSON.stringify(value, null, 2), iconName:IconNames.FLAME},
				];

				let next: DataCardInfo = {...this.state.step05, available: true, busy: true};
	
				// **** update our state ****

				this.setState({
					step04: current, 
					stepData04: data,
					step05: next, 
					subscription: value,
				});
			})
			.catch((reason: any) => {
				
				let current: DataCardInfo = {...this.state.step04, 
					busy: false,
					};

				let data: ScenarioStepData[] = [
					{id:'request', title:'Request', data:JSON.stringify(subscription, null, 2), iconName:IconNames.FLAME},
					{id:'error', title:'Error', data:`Request for Subscription (${url}) failed:\n${reason}`, iconName:IconNames.ERROR},
				];

				// **** request failed ****

				this.setState({step04: current, stepData04: data});
			});
	}

	/** Handle user clicks on the TriggerEvent button (send request to client host) */
	private handleRequestTriggerEventClick = () => {
		// **** update step ****

		let busyStep: DataCardInfo = {...this.state.step06, busy: true};

		// **** flag we are asking to trigger an event (busy) ****

		this.setState({step06: busyStep});

		// **** build the URL to post an encounter ****

		let url: string = new URL('Encounter?_format=json', this.props.fhirServerInfo.url).toString();

		// **** build our encounter ****

		let encounter: fhir.Encounter = {
			resourceType: "Encounter",
			class: {
				system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
				code: this.state.step06EncounterClass,
			},
			status: this.state.step06EncounterStatus,
			subject: {
				reference: `Patient/${this.state.selectedPatientId}`,
			}
		}

		// **** post our request to the server ****

		ApiHelper.apiPostFhir<fhir.Encounter>(url, JSON.stringify(encounter))
			.then((value: fhir.Encounter) => {
				// **** update steps - note that next step starts busy since we are waiting ****

				let current: DataCardInfo = {...this.state.step06, 
					busy: false,
				};

				let data: ScenarioStepData[] = [
					{id:'requestUrl', title:'URL', data:url, iconName:IconNames.GLOBE_NETWORK},
					{id:'request', title:'Request', data:JSON.stringify(encounter, null, 2), iconName:IconNames.FLAME},
					{id:'response', title:'Response', data:JSON.stringify(value, null, 2), iconName:IconNames.FLAME},
				];

				let next: DataCardInfo = {...this.state.step07,
					available: true,
					busy: true,
				};
	
				// **** update our state ****

				this.setState({
					step06: current,
					stepData06: data,
					step07: next,
				});
			})
			.catch((reason: any) => {
				
				let current: DataCardInfo = {...this.state.step06, 
					busy: false,
					};

				let data: ScenarioStepData[] = [
					{id:'request', title:'Request', data:JSON.stringify(encounter, null, 2), iconName:IconNames.FLAME},
					{id:'error', title:'Error', data:`Request to Post Encounter (${url}) failed:\n${reason}`, iconName:IconNames.ERROR},
				];

				// **** request failed ****

				this.setState({step06: current, stepData06: data});
			});
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
			let step: DataCardInfo = {...this.state.step04, available: false, completed: false};
			this.setState({step04: step, stepData04: [], subscription: null});
		}

		if (startingAt <= 5) {
			let step: DataCardInfo = {...this.state.step05, available: false, completed: false};
			this.setState({step05: step, stepData05: []});
		}

		if (startingAt <= 6) {
			let step: DataCardInfo = {...this.state.step06, available: false, completed: false};
			this.setState({step06: step, stepData06: []});
		}

		if (startingAt <= 7) {
			let step: DataCardInfo = {...this.state.step07, available: false, completed: false};
			this.setState({step07: step, stepData07: []});
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
