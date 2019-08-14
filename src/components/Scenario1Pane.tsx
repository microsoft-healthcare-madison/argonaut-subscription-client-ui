import * as React from 'react';

import {
  Card,
	Button,
	Classes,
  InputGroup,
  FormGroup,
  Elevation,
  Text,
  H3, H5, Spinner, Popover, NonIdealState, Tabs, Tab, ControlGroup, HTMLSelect, TabId, H6, RadioGroup, Radio
} from '@blueprintjs/core';

import {DateInput} from '@blueprintjs/datetime';

import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../models/ContentPaneProps';
import { ScenarioStepInfo } from '../models/ScenarioStepInfo';
import { ScenarioStep } from './ScenarioStep';
import { EndpointRegistration, EndpointChannelType } from '../models/EndpointRegistration';
import { ApiHelper } from '../util/ApiHelper';
import { fhir } from '../models/fhir_r4_selected';
import { TriggerRequest } from '../models/TriggerRequest';
import { TriggerInformation } from '../models/TriggerInformation';
import { PatientSelectionInfo } from '../models/PatientSelectionInfo';
import { ScenarioStepData } from '../models/ScenarioStepData';

/** Type definition for the current object's state variable */
interface ComponentState {
	step01: ScenarioStepInfo,
	stepData01: ScenarioStepData[],
	step02: ScenarioStepInfo,
	stepData02: ScenarioStepData[],
	step03: ScenarioStepInfo, 
	stepData03: ScenarioStepData[],
	step04: ScenarioStepInfo,
	stepData04: ScenarioStepData[],
	step05: ScenarioStepInfo,
	stepData05: ScenarioStepData[],
	step06: ScenarioStepInfo,
	stepData06: ScenarioStepData[],
	step07: ScenarioStepInfo,
	stepData07: ScenarioStepData[],
	step08: ScenarioStepInfo,
	stepData08: ScenarioStepData[],
	connected: boolean,
	endpointName: string,
	endpointNameWarningIsOpen: boolean,
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
}

/**
 * Walks a user through the steps of Scenario 1
 */
export class Scenario1Pane extends React.PureComponent<ContentPaneProps> {
  public state: ComponentState = {
    step01: {
			stepNumber: 1,
			heading: 'Get Topic list from FHIR Server',
			description: '',
			optional: true,
			available: true,
			completed: false,
			showBusy: false,
		},
		stepData01: [],
		step02: {
			stepNumber: 2,
			heading: 'Select or Create Patient',
			description: '',
			optional: false,
			available: true,
			completed: false,
			showBusy: false,
		},
		stepData02: [],
		step03: {
			stepNumber: 3,
			heading: 'Ask Client Host to create Endpoint',
			description: '',
			optional: false,
			available: false,
			completed: false,
			showBusy: false,
		},
		stepData03: [],
		step04: {
			stepNumber: 4,
			heading: 'Request Subscription on FHIR Server',
			description: '',
			optional: false,
			available: false,
			completed: false,
			showBusy: false,
		},
		stepData04: [],
		step05: {
			stepNumber: 5,
			heading: 'Wait on Endpoint handshake',
			description: '',
			optional: false,
			available: false,
			completed: false,
			showBusy: false,
		},
		stepData05: [],
		step06: {
			stepNumber: 6,
			heading: 'Ask Client Host to trigger event',
			description: '',
			optional: false,
			available: false,
			completed: false,
			showBusy: false,
		},
		stepData06: [],
		step07: {
			stepNumber: 7,
			heading: 'Wait on Subscription Notification',
			description: '',
			optional: false,
			available: false,
			completed: false,
			showBusy: false,
		},
		stepData07: [],
		step08: {
			stepNumber: 8,
			heading: 'Clean up',
			description: 'Delete Subscription, Destroy Endpoint, etc.',
			optional: true,
			available: true,
			completed: false,
			showBusy: false,
		},
		stepData08: [],
		connected: true,
		endpointName: '',
		endpointNameWarningIsOpen: false,
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
		step04Payload: 'id-only'
	};

	private getRandomChar = () => {
		return(String.fromCharCode(65 + Math.floor((Math.random() * 26))));
	}

	private getRandomChars = (count: number) => {
		var value = '';
		while (count > 0)
		{
			value += this.getRandomChar();
			count--;
		}
		return (value);
	}

	constructor(props: ContentPaneProps) {
		super(props);

		// **** check if we are connected to show the proper UI ***

		this.checkIfConnected(props, false);

		// **** register our callback handler ****

		props.registerHostMessageHandler(this.handleHostMessage);

		let msPerYear: number = 365.25 * 24 * 60 * 60 * 1000;
		let birthDate: Date = new Date((new Date()).valueOf() - Math.floor(Math.random() * 110));

		// **** generate some info in case a new patient is created ****

		this.state.step02PatientGivenName = `Argonaut-${Math.floor((Math.random() * 10000) + 1)}`;
		this.state.step02PatientFamilyName = `Project-${Math.floor((Math.random() * 10000) + 1)}`
		this.state.step02PatientId = `${this.getRandomChars(3)}${Math.floor((Math.random() * 10000) + 1)}`
		this.state.step02Gender = (Math.random() < 0.51) ? 'female' : 'male';
		this.state.step02BirthDate = birthDate;
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
					<H3>Scenario 1 - (<a href='http://bit.ly/argo-sub-connectathon-2019-09#scenario-1' target='_blank'>Docs</a>)</H3>
					Single-Patient Encounter notifications via REST-Hook (e.g., to a consumer app)
				</Text>
			</Card>,

			/* Get Topic list from FHIR Server */
			<ScenarioStep 
				key='step01'
				step={this.state.step01} 
				data={this.state.stepData01} 
				toaster={this.props.toaster} 
				codePaneDark={this.props.codePaneDark}
				>
				<Button
					disabled={!this.state.step01.available}
					onClick={this.handleGetTopicListClick}
					>
					Go
				</Button>
			</ScenarioStep>,

			/* Select or Create Patient */
			<ScenarioStep 
				key='step02'
				step={this.state.step02} 
				data={this.state.stepData02} 
				toaster={this.props.toaster} 
				codePaneDark={this.props.codePaneDark}
				>
				<Tabs
					animate={true}
					id='tabsStep2'
					vertical={false}
					selectedTabId={this.state.step02TabId}
					onChange={this.handleStep02TabChange}
					>
					<Tab id='s2_search' title='Search' />
					<Tab id='s2_create' title='Create' />
				</Tabs>
				{ (this.state.step02TabId === 's2_search') &&
					<Card>
						<H6>Search and Select Existing Patient</H6>
						<ControlGroup>
							<HTMLSelect
								onChange={this.handleStep02MatchTypeChange}
								defaultValue={this.state.step02MatchType}
								>
								<option>family</option>
								<option>given</option>
								<option>_id</option>
								<option>name</option>
							</HTMLSelect>
							<InputGroup
								id='step02_searchFilter'
								value={this.state.step02SearchFilter}
								onChange={this.handleSearchFilterChange}
								/>
							<Button
								onClick={this.handleStep02SearchClick}
								>
								Search
							</Button>
						</ControlGroup>
						<br />
						{ (this.state.step02SubBusy) &&
							<Spinner />
						}
						{ (!this.state.step02SubBusy) &&
							<RadioGroup
								label={`Select a patient, ${this.state.step02Patients.length} found`}
								onChange={this.handleStep02RadioChange}
								selectedValue={this.state.step02SelectedValue}
								>
									{ this.state.step02Patients.map((patientInfo) => (
										<Radio 
											key={`s02_p_${patientInfo.key}`} 
											label={patientInfo.value} 
											value={patientInfo.key} 
											checked={patientInfo.key === this.state.step02SelectedValue}
											/>
									))}
							</RadioGroup>
						}
						{ (!this.state.step02SubBusy) &&
							<Button
								disabled={(this.state.step02SelectedValue === '')}
								onClick={this.handleSetSearchedPatientClick}
								style={{margin: 5}}
								>
								Use Selected Patient
							</Button>
						}
					</Card>
				}
				{ (this.state.step02TabId === 's2_create') &&
					<Card>
						<H6>Create and PUT a new Patient</H6>
						<FormGroup
							label = 'Patient Given Name'
							helperText = 'Given Name for the new Patient'
							labelFor='patient-given-name'
							>
							<InputGroup
								id='patient-given-name'
								value={this.state.step02PatientGivenName}
								onChange={this.handlePatientGivenNameChange}
								/>
						</FormGroup>
						<FormGroup
							label = 'Patient Family Name'
							helperText = 'Family Name for the new Patient'
							labelFor='patient-family-name'
							>
							<InputGroup
								id='patient-family-name'
								value={this.state.step02PatientFamilyName}
								onChange={this.handlePatientFamilyNameChange}
								/>
						</FormGroup>
						<FormGroup
							label='Patient ID'
							helperText='ID for the new Patient (must contain at least one letter)'
							labelFor='patient-id'
							>
							<InputGroup
								id='patient-id'
								value={this.state.step02PatientId}
								onChange={this.handlePatientIdChange}
								/>
						</FormGroup>
						<HTMLSelect
							onChange={this.handleStep02GenderChange}
							defaultValue={this.state.step02Gender}
							>
							<option>female</option>
							<option>male</option>
						</HTMLSelect>
						<FormGroup
							label='Patient Birth Date'
							helperText='Birth date of this patient'
							labelFor='patient-birthdate'
							>
							<DateInput
								onChange={this.handlePatientBirthDateChange}
								formatDate={date => date.toLocaleDateString()}
								parseDate={str => new Date(str)}
								value={this.state.step02BirthDate}
								/>
						</FormGroup>
						{ (!this.state.step02SubBusy) &&
							<Button
								disabled={(this.state.step02PatientId === '')}
								onClick={this.handleSetCreatedPatientClick}
								style={{margin: 5}}
								>
								Create Patient
							</Button>
						}
						{ (this.state.step02SubBusy) &&
							<Spinner />
						}

					</Card>
				}
			</ScenarioStep>,

			/* Ask Client Host to create Endpoint */
			<ScenarioStep 
				key='step03'
				step={this.state.step03} 
				data={this.state.stepData03} 
				toaster={this.props.toaster} 
				codePaneDark={this.props.codePaneDark}
				>
				<div>
					<FormGroup
						label = 'Endpoint name'
						helperText = 'Name of the endpoint (appears in URL)'
						labelFor='endpoint-name'
						>
						<InputGroup
							disabled={!this.state.step03.available}
							id='endpoint-name'
							value={this.state.endpointName}
							onChange={this.handleEndpointNameChange}
							/>
					</FormGroup>
					<Popover
						isOpen={this.state.endpointNameWarningIsOpen}
						canEscapeKeyClose={true}
						usePortal={true}
						>
						<Button
							disabled={!this.state.step03.available}
							onClick={this.handleClientHostCreateEndpointClick}
							>
							Go
						</Button>
						<Card key='text'>
							<H5>Invalid Endpoint Name</H5>
							<p>A valid endpoint name is required for this scenario</p>
							<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 15 }}>
								<Button
									className={Classes.POPOVER_DISMISS}
									onClick={() => this.setState({patientFilterWarningIsOpen: false})}
									>
									OK
								</Button>
							</div>
						</Card>
					</Popover>
				</div>
			</ScenarioStep>,

			/* Request Subscription on FHIR Server */
			<ScenarioStep 
				key='step04'
				step={this.state.step04} 
				data={this.state.stepData04} 
				toaster={this.props.toaster} 
				codePaneDark={this.props.codePaneDark}
				>
				<HTMLSelect
					onChange={this.handleStep04PayloadChange}
					defaultValue={this.state.step04Payload}
					>
					<option>empty</option>
					<option>id-only</option>
					<option>full-resource</option>
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
				toaster={this.props.toaster} 
				codePaneDark={this.props.codePaneDark} 
				/>,

			/* Ask Client Host to trigger event */
			<ScenarioStep 
				key='step06'
				step={this.state.step06} 
				data={this.state.stepData06} 
				toaster={this.props.toaster} 
				codePaneDark={this.props.codePaneDark}
				>
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
				toaster={this.props.toaster} 
				codePaneDark={this.props.codePaneDark} 
				/>,

			/* Clean up */
			<ScenarioStep 
				key='step08'
				step={this.state.step08} 
				data={this.state.stepData08} 
				toaster={this.props.toaster} 
				codePaneDark={this.props.codePaneDark}
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

	private handleStep04PayloadChange = (event: React.FormEvent<HTMLSelectElement>) => {
		this.setState({step04Payload: event.currentTarget.value})
	}

	private handleStep02GenderChange = (event: React.FormEvent<HTMLSelectElement>) => {
		this.setState({step02BirthDate: event.currentTarget.value})
	}

	private handleStep02MatchTypeChange = (event: React.FormEvent<HTMLSelectElement>) => {
		this.setState({step02MatchType: event.currentTarget.value})
	}

	private handleStep02SearchClick = () => {
		// **** flag we are searching ****

		this.setState({step02SubBusy: true});

    // **** construct the search url ****

		var url: string = new URL('Patient/', this.props.fhirServerInfo.url).toString();
		
		if (this.state.step02SearchFilter) {
				url += `?${encodeURIComponent(this.state.step02MatchType)}=${encodeURIComponent(this.state.step02SearchFilter)}`;
		}

    // **** attempt to get the list of Patients ****

    ApiHelper.apiGet<fhir.Bundle>(url)
      .then((value: fhir.Bundle) => {

				// **** check for no values ****

				if ((!value) || (!value.entry) || (!value.entry)) {
						this.setState({step02SubBusy: false, step02Patients: []});
				}

				var patients: PatientSelectionInfo[] = [];

				// **** loop over patients ****

				value.entry!.forEach(entry => {
					if (!entry.resource) return;

					let patient: fhir.Patient = entry.resource as fhir.Patient;

					if ((patient.id) && (patient.name)) {
						patients.push({
							key: patient.id!, 
							value: `${patient.name![0].family}, ${patient.name![0].given} (${patient.id!})`});
					}
				});

				// **** update our state ****

				this.setState({step02Patients: patients, step02SubBusy: false});
      })
      .catch((reason: any) => {
				// **** update step ****

				let current: ScenarioStepInfo = {...this.state.step02, 
					completed: false, 
					showBusy: false,
				};
				let data: ScenarioStepData[] = [
					{id: 'request', title: 'Request', data: url, iconName:IconNames.GLOBE_NETWORK},
					{id: 'error', title: 'Error', data: `Failed to get topic list from: ${url}:\n${reason}`, iconName:IconNames.ERROR},
				];

				// **** update our state ****

				this.setState({step02: current, stepData02: data, step02SubBusy: false});      
			})
      ;
	}

	private handleStep02RadioChange = (event: React.FormEvent<HTMLInputElement>) => {
		this.setState({step02SelectedValue: event.currentTarget.value});
	}

	private handleStep02TabChange = (navbarTabId: TabId) => {
		this.setState({step02TabId: navbarTabId.toString()})
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

			let current: ScenarioStepInfo = {...this.state.step05,
				completed: true, 
				showBusy: false,
			};
			let data: ScenarioStepData[] = [
				{id: 'handshake', title: 'Handshake', data: JSON.stringify(bundle, null, 2), iconName:IconNames.FLAME}
			];

			let next: ScenarioStepInfo = {...this.state.step06, available: true};

			// **** update our state ****

			this.setState({
				step05: current, 
				stepData05: data,
				step06: next, 
			});
		} else {
			// **** update step ****

			let current: ScenarioStepInfo = {...this.state.step07,
				completed: true, 
				showBusy: false,
			};

			let rec:ScenarioStepData = {
				id:`event_${this.state.stepData07.length}`, 
				title: `Event ${this.state.stepData07.length}`, 
				data: JSON.stringify(bundle, null, 2),
				iconName:IconNames.FLAME
			}

			let data: ScenarioStepData[] = this.state.stepData07.slice();
			data.push(rec);

			// **** update our state ****

			this.setState({step07: current, stepData07: data});
		}
	}

	/** Handle user clicks on the GetTopicList button */
	private handleGetTopicListClick = () => {
		// **** update step ****

		var busyStep: ScenarioStepInfo = {...this.state.step01, showBusy: true };

		// **** flag we are asking for Topics (busy) ****

		this.setState({step01: busyStep});

    // **** construct the registration REST url ****

    let url: string = new URL('Topic/', this.props.fhirServerInfo.url).toString();

    // **** attempt to get the list of Topics ****

    ApiHelper.apiGet<fhir.Topic[]>(url)
      .then((value: fhir.Topic[]) => {

				// **** update step ****

				let current: ScenarioStepInfo = {...this.state.step01, 
					completed: true, 
					showBusy: false,
				};

				let data: ScenarioStepData[] = [
					{id:'request', title:'Request', data:url, iconName:IconNames.GLOBE_NETWORK},
					{id:'topics', title:'Topics', data:JSON.stringify(value, null, 2), iconName:IconNames.FLAME}
				];

				// **** update our state ****

				this.setState({ step01: current, stepData01: data });
      })
      .catch((reason: any) => {
				// **** update step ****

				let current: ScenarioStepInfo = {...this.state.step01, 
					completed: false, 
					showBusy: false,
				};

				let data: ScenarioStepData[] = [
					{id:'request', title:'Request', data:url, iconName:IconNames.GLOBE_NETWORK},
					{id:'error', title:'Error', data:`Failed to get topic list from: ${url}:\n${reason}`, iconName:IconNames.ERROR}
				];
				// **** update our state ****

				this.setState({	step01: current, stepData01: data });      
			})
      ;
	}

	/** Handle user clicks on the SetPatient button from Search (validate and enable next step) */
	private handleSetSearchedPatientClick = () => {
		let selectedPatientId: string = this.state.step02SelectedValue;

		// **** update steps ****

		let current: ScenarioStepInfo = {...this.state.step02, 
			completed: true, 
		};

		let rec:ScenarioStepData = {
			id:'info', 
			title:'Info', 
			data:`Using Existing Patient (id): ${selectedPatientId}`,
			iconName: IconNames.INFO_SIGN
		}

		var data: ScenarioStepData[] = this.state.stepData02.slice();
		data.push(rec);

		let next: ScenarioStepInfo = {...this.state.step03, available: true};

		// **** update our state, generate a default name for the endpoint ****

		this.setState({
			step02: current, 
			stepData02: data,
			step03: next, 
			selectedPatientId: selectedPatientId,
			endpointName: `p${selectedPatientId}-${Math.floor((Math.random() * 10000) + 1)}`,
		});
	}

	/** Handle user clicks on the SetPatient button from Create (validate and enable next step) */
	private handleSetCreatedPatientClick = () => {
		// **** flag we are creating ****

		this.setState({step02SubBusy: true});
		
		// **** create a new patient ****

		var patient: fhir.Patient = {
			resourceType: 'Patient',
			id: this.state.step02PatientId,
			name: [{
				family: this.state.step02PatientFamilyName,
				given: [this.state.step02PatientGivenName],
				use: 'official'
			}],
			gender: this.state.step02Gender,
			birthDate: this.getFhirDateFromDate(this.state.step02BirthDate),
		}

		// **** PUT this on the server ****

		let url: string = new URL(`Patient/${patient.id!}?_format=json`, this.props.fhirServerInfo.url).toString();

		ApiHelper.apiPutFhir<fhir.Patient>(url.toString(), JSON.stringify(patient))
			.then((value: fhir.Patient) => {
				// **** update steps ****

				let current: ScenarioStepInfo = {...this.state.step02, 
					completed: true,
				};

				let data: ScenarioStepData[] = [
					{id:'request', title:'Request', data:JSON.stringify(patient, null, 2), iconName:IconNames.GLOBE_NETWORK},
					{id:'response', title:'Response', data:JSON.stringify(value, null, 2), iconName:IconNames.FLAME},
					{id:'info', title:'Info', data:`Using New Patient (id): ${value.id!}`, iconName:IconNames.INFO_SIGN},
				];

				let next: ScenarioStepInfo = {...this.state.step03, available: true};

				// **** update our state, generate a default name for the endpoint ****

				this.setState({
					step02: current, 
					stepData02: data,
					step03: next, 
					selectedPatientId: value.id!,
					endpointName: `rest-hook-${value.id!}-${Math.floor((Math.random() * 10000) + 1)}`,
					step02SubBusy: false,
				});
			})
			.catch((reason: any) => {
				// **** update step ****

				let failed: ScenarioStepInfo = {...this.state.step02,
					completed: false,
				}; 

				let data: ScenarioStepData[] = [
					{id:'request', title:'Request', data:JSON.stringify(patient, null, 2), iconName:IconNames.GLOBE_NETWORK},
					{id:'error', title:'Error', data:`Request to create patient (${url}) failed:\n${reason}`, iconName:IconNames.ERROR},
				];

				// **** update our state ****

				this.setState({step02: failed, step02SubBusy: false});
			})
			;

	}

	/** Handle user clicks on the CreateEndpoint button (send request to client host, on success enable next step) */
	private handleClientHostCreateEndpointClick = () => {
		// **** grab current input, filtered to alpha-numeric ****

		var endpointName: string = this.state.endpointName.replace(/[^a-z0-9]/gi,'');

		// **** validate input ****

		if (!endpointName) {
			// **** warn user ****

			this.setState({endpointNameWarningIsOpen: true});
			return;
		}

		// **** update step ****

		let busyStep: ScenarioStepInfo = {...this.state.step03, showBusy: true };

		// TODO(ginoc): destroy any existing endpoints

		// **** flag we are asking to create the endpoint (busy) ****

		this.setState({step03: busyStep});

		// **** build the url for our call ***

		let url: URL = new URL(
			`api/Clients/${this.props.clientHostInfo.registration}/Endpoints/`, 
			this.props.clientHostInfo.url
			);

		// **** build the endpoint registration object ****

		var endpointRegistration: EndpointRegistration = {
			urlPart: this.state.endpointName, 
			channelType: EndpointChannelType.RestHook,
		}

		// **** ask for this endpoint to be created ****

		ApiHelper.apiPost<EndpointRegistration>(url.toString(), JSON.stringify(endpointRegistration))
			.then((value: EndpointRegistration) => {
				// **** make the next step available ****

				let current: ScenarioStepInfo = {...this.state.step03, completed: true, showBusy: false};
				let next: ScenarioStepInfo = {...this.state.step04, available: true};

				// **** show the client endpoint information ****

				let data: ScenarioStepData[] = [
					{id:'request', title:'Request', data:JSON.stringify(endpointRegistration, null, 2), iconName:IconNames.GLOBE_NETWORK},
					{id:'response', title:'Response', data:JSON.stringify(value, null, 2), iconName:IconNames.INFO_SIGN},
					{id:'info', title:'Info', iconName:IconNames.INFO_SIGN, 
						data:'Endpoint Created:\n' +
						`\tUID: ${value.uid}\n` +
						`\tURL: ${this.props.clientHostInfo.url}Endpoints/${value.urlPart}/\n` +
						`\tOR:  ${this.props.clientHostInfo.url}Endpoints/${value.uid}/\n` +
						''},
				];

				// **** update our state ****

				this.setState({
					step03: current,
					stepData03: data, 
					step04: next, 
					endpoint: value,
				});
			})
			.catch((reason: any) => {
				
				let current: ScenarioStepInfo = {...this.state.step03,
					showBusy: false,
					};
				
				let data: ScenarioStepData[] = [
					{id:'request', title:'Request', data:JSON.stringify(endpointRegistration, null, 2), iconName:IconNames.INFO_SIGN},
					{id:'error', title:'Error', data:`Request to for endpoint (${url}) failed:\n${reason}`, iconName:IconNames.ERROR},
				];

				// **** request failed ****

				this.setState({step03: current, stepData03: data});
			});
	}

	/** Get a FHIR Instant value from a JavaScript Date */
	private getInstantFromDate = (date: Date) => {
		return (JSON.stringify(date).replace(/['"]+/g, ''));
		// return (
		// 	date.getFullYear() +
		// 	((date.getMonth() < 9) ? '0' : '') + (date.getMonth()+1) +
		// 	((date.getDate() < 10) ? '0' : '') + date.getDate() +
		// 	((date.getHours() < 10) ? '0' : '') + date.getHours() +
		// 	((date.getMinutes() < 10) ? '0' : '') + date.getMinutes() +
		// 	((date.getSeconds() < 10) ? '0' : '') + date.getSeconds() 
		// 	)
		// 	;
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

		let busyStep: ScenarioStepInfo = {...this.state.step04, showBusy: true};

		// TODO(ginoc): destroy any existing Subscriptions

		// **** flag we are asking to create the subscription (busy) ****

		this.setState({step04: busyStep, subscription: null});

		// **** build the url for our call ***

    let url: URL = new URL('Subscription/', this.props.fhirServerInfo.url);
 
		// **** build our subscription channel information ****

		let channel: fhir.SubscriptionChannel = {
			endpoint: `${this.props.clientHostInfo.url}Endpoints/${this.state.endpoint!.urlPart}`,
			header: ['Authorization: Bearer secret-token-abc-123'],
			heartbeatPeriod: 60,
			payload: {content: this.state.step04Payload, contentType: 'application/fhir+json'},
			type: { text: 'rest-hook'},
		}

		// **** build our filter information ****

		let filter: fhir.SubscriptionFilterBy = {
			matchType: '=',
			name: 'Patient',
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

				let current: ScenarioStepInfo = {...this.state.step04, 
					completed: true, 
					showBusy: false,
				};

				let data: ScenarioStepData[] = [
					{id:'request', title:'Request', data:JSON.stringify(subscription, null, 2), iconName:IconNames.FLAME},
					{id:'response', title:'Response', data:JSON.stringify(value, null, 2), iconName:IconNames.FLAME},
				];

				let next: ScenarioStepInfo = {...this.state.step05, available: true, showBusy: true};
	
				// **** update our state ****

				this.setState({
					step04: current, 
					stepData04: data,
					step05: next, 
					subscription: value,
				});
			})
			.catch((reason: any) => {
				
				let current: ScenarioStepInfo = {...this.state.step04, 
					showBusy: false,
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

		let busyStep: ScenarioStepInfo = {...this.state.step06, showBusy: true};

		// **** flag we are asking to trigger an event (busy) ****

		this.setState({step06: busyStep});

		// **** build the url for our call ***

    let url: URL = new URL('Triggers/', this.props.clientHostInfo.url);
 
		// **** build our trigger ****

		let triggerRequest: TriggerRequest = {
			fhirServerUrl: this.props.fhirServerInfo.url,
			resourceName: "Encounter",
			filterName: "patient",
			filterMatchType: "=",
			filterValue: `Patient/${this.state.selectedPatientId}`,
			repetitions: 1,
			delayMilliseconds: 0,
			ignoreErrors: false,
		}

		// **** post our request to the server ****

		ApiHelper.apiPost<TriggerInformation>(url.toString(), JSON.stringify(triggerRequest))
			.then((value: TriggerInformation) => {
				// **** update steps - note that next step starts busy since we are waiting ****

				let current: ScenarioStepInfo = {...this.state.step06, 
					showBusy: false,
				};

				let data: ScenarioStepData[] = [
					{id:'request', title:'Request', data:JSON.stringify(triggerRequest, null, 2), iconName:IconNames.INFO_SIGN},
					{id:'response', title:'Response', data:JSON.stringify(value, null, 2), iconName:IconNames.INFO_SIGN},
					{id:'info', title:'Info', data:`Trigger request accepted: ${value.uid}...`, iconName:IconNames.INFO_SIGN},
				];

				let next: ScenarioStepInfo = {...this.state.step07,
					available: true,
					showBusy: true,
				};
	
				// **** update our state ****

				this.setState({
					step06: current,
					stepData06: data,
					step07: next,
					triggerUid: value.uid,
				});
			})
			.catch((reason: any) => {
				
				let current: ScenarioStepInfo = {...this.state.step06, 
					showBusy: false,
					};

				let data: ScenarioStepData[] = [
					{id:'request', title:'Request', data:JSON.stringify(triggerRequest, null, 2), iconName:IconNames.INFO_SIGN},
					{id:'error', title:'Error', data:`Request to create trigger (${url}) failed:\n${reason}`, iconName:IconNames.ERROR},
				];

				// **** request failed ****

				this.setState({step06: current, stepData06: data});
			});
	}

	/** Handle user clicks on the CleanUp button (delete Subscription from FHIR Server, Endpoint from ClientHost) */
	private handleCleanUpClick = () => {

	}

	/** Process HTML events for the patient filter text box (update state for managed) */
  private handleSearchFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({searchFilter: event.target.value});
	}

	/** Process HTML events for the endpoint name text box (update state for managed) */
	private handleEndpointNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({endpointName: event.target.value});
	}

	private handlePatientGivenNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({step02PatientGivenName: event.target.value});
	}

	private handlePatientFamilyNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({step02PatientFamilyName: event.target.value});
	}

	private handlePatientIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({step02PatientId: event.target.value});
	}

	private handlePatientBirthDateChange = (selectedDate: Date, isUserChange: boolean) => {
		this.setState({step02BirthDate: selectedDate});
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
