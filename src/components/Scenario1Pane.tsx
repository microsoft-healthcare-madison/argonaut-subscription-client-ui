import * as React from 'react';

import {
  Flex,
  Box
} from 'reflexbox';

import {
  Card,
	Button,
	Classes,
  Collapse,
  InputGroup,
  FormGroup,
  Elevation,
  Text,
  H3, H5, Spinner, Popover, NonIdealState
} from '@blueprintjs/core';

import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../models/ContentPaneProps';
import { ScenarioStepInfo } from '../models/ScenarioStepInfo';
import { ScenarioStep } from './ScenarioStep';
import { EndpointRegistration, EndpointChannelType } from '../models/EndpointRegistration';
import { ApiHelper } from '../util/ApiHelper';
import { fhir } from '../models/fhir_r4_selected';
import { TriggerRequest } from '../models/TriggerRequest';
import { TriggerInformation } from '../models/TriggerInformation';

/** Type definition for the current object's state variable */
interface ComponentState {
	step01: ScenarioStepInfo,
	step02: ScenarioStepInfo,
	step03: ScenarioStepInfo,
	step04: ScenarioStepInfo,
	step05: ScenarioStepInfo,
	step06: ScenarioStepInfo,
	step07: ScenarioStepInfo,
	step08: ScenarioStepInfo,
	connected: boolean,
	patientFilter: string,
	patientFilterWarningIsOpen: boolean,
	endpointName: string,
	endpointNameWarningIsOpen: boolean,
	endpoint: EndpointRegistration | null,
	subscription: fhir.Subscription | null,
	triggerUid: string,
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
			data: ''
		},
		step02: {
			stepNumber: 2,
			heading: 'Set Patient filter',
			description: '',
			optional: false,
			available: true,
			completed: false,
			showBusy: false,
			data: ''
		},
		step03: {
			stepNumber: 3,
			heading: 'Ask Client Host to create Endpoint',
			description: '',
			optional: false,
			available: false,
			completed: false,
			showBusy: false,
			data: ''
		},
		step04: {
			stepNumber: 4,
			heading: 'Request Subscription on FHIR Server',
			description: '',
			optional: false,
			available: false,
			completed: false,
			showBusy: false,
			data: ''
		},
		step05: {
			stepNumber: 5,
			heading: 'Wait on Endpoint handshake',
			description: '',
			optional: false,
			available: false,
			completed: false,
			showBusy: false,
			data: ''
		},
		step06: {
			stepNumber: 6,
			heading: 'Ask Client Host to trigger event',
			description: '',
			optional: false,
			available: false,
			completed: false,
			showBusy: false,
			data: ''
		},
		step07: {
			stepNumber: 7,
			heading: 'Wait on Subscription Notification',
			description: '',
			optional: false,
			available: false,
			completed: false,
			showBusy: false,
			data: ''
		},
		step08: {
			stepNumber: 8,
			heading: 'Clean up',
			description: 'Delete Subscription, Destroy Endpoint, etc.',
			optional: true,
			available: true,
			completed: false,
			showBusy: false,
			data: ''
		},
		connected: true,
		patientFilter: '123',
		patientFilterWarningIsOpen: false,
		endpointName: '',
		endpointNameWarningIsOpen: false,
		endpoint: null,
		subscription: null,
		triggerUid: '',
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
				<Flex p={1} align='center' column>
        	<Box px={1} w={1} m={1}>
						<Card elevation={Elevation.TWO}>
							<NonIdealState
								icon={IconNames.ISSUE}
								title='Not Connected to Client Host'
								description='You must be connected to a FHIR Server and Client Host before running this scenario.'
								/>
						</Card>
					</Box>
				</Flex>
			);
		}

		// **** if we are connected, render scenario content ****
    return (
      <Flex p={1} align='center' column>
        <Box px={1} w={1} m={1}>
          <Card elevation={Elevation.TWO}>
            <Text>
              <H3>Scenario 1 - (<a href='http://bit.ly/argo-sub-connectathon-2019-09#scenario-1' target='_blank'>Docs</a>)</H3>
              Single-Patient Encounter notifications via REST-Hook (e.g., to a consumer app)
            </Text>
          </Card>
        </Box>

				{/* Get Topic list from FHIR Server */}
        <ScenarioStep step={this.state.step01}>
          <div>
            <Button
							disabled={!this.state.step01.available}
							onClick={this.handleGetTopicListClick}
              >
              Go
            </Button>
          </div>
        </ScenarioStep>

				{/* Set Patient filter */}
        <ScenarioStep step={this.state.step02}>
          <div>
						<FormGroup
              label = 'Patient filter'
              helperText = 'Patient ID to use in filtering for Admissions events'
              labelFor='patient-filter'
              >
							<InputGroup
								disabled={!this.state.step02.available}
								id='patient-filter'
								value={this.state.patientFilter}
								onChange={this.handlePatientFilterChange}
								/>
            </FormGroup>
						<Popover
							isOpen={this.state.patientFilterWarningIsOpen}
							canEscapeKeyClose={true}
							usePortal={true}
							>
							<Button
								disabled={!this.state.step02.available}
								onClick={this.handleSetPatientFilterClick}
								>
								Go
							</Button>
							<Card key='text'>
								<H5>Invalid Patient Filter</H5>
								<p>A valid patient filter is required for this scenario</p>
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
        </ScenarioStep>

				{/* Ask Client Host to create Endpoint */}
        <ScenarioStep step={this.state.step03}>
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
				</ScenarioStep>

				{/* Request Subscription on FHIR Server */}
        <ScenarioStep step={this.state.step04}>
					<div>
						<Button
							disabled={!this.state.step04.available}
							onClick={this.handleRequestSubscriptionClick}
              >
              Go
            </Button>
					</div>
				</ScenarioStep>

				{/* Wait on Endpoint handshake */}
        <ScenarioStep step={this.state.step05}>
					<div>
						{/* <Spinner /> */}
					</div>
				</ScenarioStep>

				{/* Ask Client Host to trigger event */}
        <ScenarioStep step={this.state.step06}>
					<div>
						<Button
							disabled={!this.state.step06.available}
							onClick={this.handleRequestTriggerEventClick}
              >
              Go
            </Button>
					</div>
				</ScenarioStep>

				{/* Wait on Subscription Notification */}
        <ScenarioStep step={this.state.step07}>
					<div>
						{/* <Spinner /> */}
					</div>
				</ScenarioStep>

				{/* Clean up */}
        <ScenarioStep step={this.state.step08}>
					<div>
						<Button
							disabled={!this.state.step08.available}
							onClick={this.handleCleanUpClick}
              >
              Go
            </Button>
					</div>
				</ScenarioStep>

      </Flex>
    );
	}

	/** Callback function to process ClientHost messages */
	private handleHostMessage = (message: string) => {
		// **** vars we want ****

		var eventCount: number = NaN;
		var status: string;
		var topicUrl: string;
		var subscriptionUrl: string;

		// **** resolve this message into a bundle ****

		let bundle: fhir.Bundle = JSON.parse(message);

		// **** check for the extensions we need ****

		if ((bundle) &&
				(bundle.meta) &&
				(bundle.meta.extension))
		{
			bundle.meta.extension.forEach(element => {
				if (element.url.endsWith('subscriptionEventCount')) {
					eventCount = element.valuePositiveInt!;
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

			var current: ScenarioStepInfo = {...this.state.step05,
				completed: true, 
				showBusy: false,
				data: JSON.stringify(bundle, null, '\t'),
			};
			var next: ScenarioStepInfo = {...this.state.step06, available: true};

			// **** update our state ****

			this.setState({
				step05: current, 
				step06: next, 
			});
		} else {
			// **** update step ****

			var current: ScenarioStepInfo = {...this.state.step07,
				completed: true, 
				showBusy: false,
				data: JSON.stringify(bundle, null, '\t'),
			};

			// **** update our state ****

			this.setState({
				step07: current,
			});
		}

		// **** log for now ****

		console.log('Received bundle: ', bundle);
	}

	/** Handle user clicks on the GetTopicList button */
	private handleGetTopicListClick = () => {
		// **** update step ****

		var busyStep: ScenarioStepInfo = {...this.state.step01, showBusy: true };

		// **** flag we are asking for Topics (busy) ****

		this.setState({step01: busyStep});

    // **** construct the registration REST url ****

    let url: URL = new URL('Topic/', this.props.fhirServerInfo.url);

    // **** attempt to get the list of Topics ****

    ApiHelper.apiGet<fhir.Topic[]>(url.toString())
      .then((value: fhir.Topic[]) => {

				// **** update step ****

				var current: ScenarioStepInfo = {...this.state.step01, 
					completed: true, 
					showBusy: false,
					data: JSON.stringify(value, null, '\t')
				};

				// **** update our state ****

				this.setState({ step01: current });
      })
      .catch((reason: any) => {
				// **** update step ****

				var current: ScenarioStepInfo = {...this.state.step01, 
					completed: false, 
					showBusy: false,
					data: `Failed to get topic list from: ${url}:\n${reason}`
				};

				// **** update our state ****

				this.setState({	step01: current });      
			})
      ;
	}

	/** Handle user clicks on the SetPatientFilter button (validate and enable next step) */
	private handleSetPatientFilterClick = () => {

		// **** grab current input, filtered to alpha-numeric ****

		var patientFilter: string = this.state.patientFilter.replace(/[^a-z0-9]/gi,'');

		// **** validate input ****

		if (!patientFilter) {
			// **** warn user ****

			this.setState({patientFilterWarningIsOpen: true});
			return;
		}

		// **** update steps ****

		var current: ScenarioStepInfo = {...this.state.step02, 
			completed: true, 
			data: `Patient filter set to: ${patientFilter}`
		};
		var next: ScenarioStepInfo = {...this.state.step03, available: true};

		// **** update our state, generate a default name for the endpoint ****

		this.setState({
			step02: current, 
			step03: next, 
			patientFilter: patientFilter,
			endpointName: `p${patientFilter}-${Math.floor((Math.random() * 10000) + 1)}`,
		});
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

		var busyStep: ScenarioStepInfo = {...this.state.step03, showBusy: true };

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

				var current: ScenarioStepInfo = {...this.state.step03, completed: true, showBusy: false};
				var next: ScenarioStepInfo = {...this.state.step04, available: true};

				// **** show the client endpoint information ****

				current.data = 'Endpoint Created:\n' +
					`\tUID: ${value.uid}\n` +
					`\tURL: ${this.props.clientHostInfo.url}Endpoints/${value.urlPart}/\n` +
					`\tOR:  ${this.props.clientHostInfo.url}Endpoints/${value.uid}/\n` +
					'';
		
				// **** update our state ****

				this.setState({
					step03: current, 
					step04: next, 
					endpoint: value,
				});
			})
			.catch((reason: any) => {
				
				var current: ScenarioStepInfo = {...this.state.step03, 
					data: 'Request for endpoint failed! Please change your filter and try again.',
					showBusy: false,
					};

				// **** request failed ****

				this.setState({step03: current});
			});
	}

	private getInstantFromDate = (date: Date) => {
		return (
			date.getFullYear() +
			((date.getMonth() < 9) ? '0' : '') + (date.getMonth()+1) +
			((date.getDate() < 10) ? '0' : '') + date.getDate() +
			((date.getHours() < 10) ? '0' : '') + date.getHours() +
			((date.getMinutes() < 10) ? '0' : '') + date.getMinutes() +
			((date.getSeconds() < 10) ? '0' : '') + date.getSeconds() 
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
			payload: {content: 'id-only', contentType: 'application/fhir+json'},
			type: { text: 'rest-hook'},
		}

		// **** build our filter information ****

		let filter: fhir.SubscriptionFilterBy = {
			matchType: '=',
			name: 'Patient',
			value: `Patient/${this.state.patientFilter}`	//`Patient/${this.state.patientFilter},Patient/K123`
		}

		var expirationTime:Date = new Date();
		expirationTime.setHours(expirationTime.getHours() + 1);

		// **** build the subscription object ****

		let subscription: fhir.Subscription = {
			channel: channel,
			filterBy: [filter],
			end: this.getInstantFromDate(expirationTime),
			topic: {reference:  new URL('Topic/admissions', this.props.fhirServerInfo.url).toString()},
			reason: 'Client Testing',
			status: 'requested',
		}

		// **** post our request to the server ****

		ApiHelper.apiPost<fhir.Subscription>(url.toString(), JSON.stringify(subscription))
			.then((value: fhir.Subscription) => {
				// **** update steps - note that next step starts busy since we are waiting ****

				var current: ScenarioStepInfo = {...this.state.step04, 
					completed: true, 
					showBusy: false,
					data: JSON.stringify(subscription, null, '\t'),
				};
				var next: ScenarioStepInfo = {...this.state.step05, available: true, showBusy: true};
	
				// **** update our state ****

				this.setState({
					step04: current, 
					step05: next, 
					subscription: value,
				});
			})
			.catch((reason: any) => {
				
				var current: ScenarioStepInfo = {...this.state.step04, 
					data: 'Request for Subscription failed! Please try again.',
					showBusy: false,
					};

				// **** request failed ****

				this.setState({step04: current});
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
			filterName: "Patient",
			filterMatchType: "=",
			filterValue: `Patient/${this.state.patientFilter}`,
			repetitions: 1,
			delayMilliseconds: 0,
			ignoreErrors: false,
		}

		// **** post our request to the server ****

		ApiHelper.apiPost<TriggerInformation>(url.toString(), JSON.stringify(triggerRequest))
			.then((value: TriggerInformation) => {
				// **** update steps - note that next step starts busy since we are waiting ****

				var current: ScenarioStepInfo = {...this.state.step06, 
					showBusy: false,
					data: `Trigger: ${value.uid}. . .`,
				};
				var next: ScenarioStepInfo = {...this.state.step07,
					available: true,
					showBusy: true,
				};
	
				// **** update our state ****

				this.setState({
					step06: current,
					step07: next,
					triggerUid: value.uid,
				});
			})
			.catch((reason: any) => {
				
				var current: ScenarioStepInfo = {...this.state.step06, 
					data: 'Request for Event Trigger failed! Please try again.',
					showBusy: false,
					};

				// **** request failed ****

				this.setState({step06: current});
			});
	}

	/** Handle user clicks on the CleanUp button (delete Subscription from FHIR Server, Endpoint from ClientHost) */
	private handleCleanUpClick = () => {

	}

	/** Process HTML events for the patient filter text box (update state for managed) */
  private handlePatientFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({patientFilter: event.target.value})
	}

	/** Process HTML events for the endpoint name text box (update state for managed) */
	private handleEndpointNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({endpointName: event.target.value})
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
