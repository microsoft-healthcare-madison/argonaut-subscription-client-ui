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
			data: ''
		},
		step02: {
			stepNumber: 2,
			heading: 'Set Patient filter',
			description: '',
			optional: false,
			available: true,
			completed: false,
			data: ''
		},
		step03: {
			stepNumber: 3,
			heading: 'Ask Client Host to create Endpoint',
			description: '',
			optional: false,
			available: false,
			completed: false,
			data: ''
		},
		step04: {
			stepNumber: 4,
			heading: 'Request Subscription on FHIR Server',
			description: '',
			optional: false,
			available: false,
			completed: false,
			data: ''
		},
		step05: {
			stepNumber: 5,
			heading: 'Wait on Endpoint handshake',
			description: '',
			optional: false,
			available: false,
			completed: false,
			data: ''
		},
		step06: {
			stepNumber: 6,
			heading: 'Ask Client Host to trigger event',
			description: '',
			optional: false,
			available: false,
			completed: false,
			data: ''
		},
		step07: {
			stepNumber: 7,
			heading: 'Wait on Subscription Notification',
			description: '',
			optional: false,
			available: false,
			completed: false,
			data: ''
		},
		step08: {
			stepNumber: 8,
			heading: 'Clean up',
			description: 'Delete Subscription, Destroy Endpoint, etc.',
			optional: true,
			available: true,
			completed: false,
			data: ''
		},
		connected: true,
		patientFilter: '',
		patientFilterWarningIsOpen: false,
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
            <Button
              >
              Toggle Results
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
						<Button
							disabled={!this.state.step03.available}
							onClick={this.handleClientHostCreateEndpointClick}
              >
              Go
            </Button>
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
						{ this.showSpinnerIfWaiting(this.state.step05) }
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
		// console.log('Scenario1 recevied:', message);
	}

	/** Function which can render a spinner if the step is available and not completed */
	private showSpinnerIfWaiting(step: ScenarioStepInfo) {
		if (step.available && !step.completed) {
			return <Spinner size={Spinner.SIZE_STANDARD} />;
		}
		return null;
	}

	/** Handle user clicks on the GetTopicList button */
	private handleGetTopicListClick = () => {

	}
 
	/** Handle user clicks on the SetPatientFilter button (validate and enable next step) */
	private handleSetPatientFilterClick = () => {

		// **** validate input ****

		if (!this.state.patientFilter) {
			// **** warn user ****

			this.setState({patientFilterWarningIsOpen: true});
			return;
		}

		// **** update steps ****

		var current: ScenarioStepInfo = {...this.state.step02, completed: true};
		var next: ScenarioStepInfo = {...this.state.step03, available: true};

		// **** update our state ****

		this.setState({step02: current, step03: next});
	}

	/** Handle user clicks on the CreateEndpoint button (send request to client host, on success enable next step) */
	private handleClientHostCreateEndpointClick = () => {
		var current: ScenarioStepInfo = {...this.state.step03, completed: true};
		var next: ScenarioStepInfo = {...this.state.step04, available: true};

		this.setState({step03: current, step04: next});
	}

	/** Handle user clicks on the CreateSubscription button (send request to FHIR server, on success enable next step) */
	private handleRequestSubscriptionClick = () => {
		var current: ScenarioStepInfo = {...this.state.step04, completed: true};
		var next: ScenarioStepInfo = {...this.state.step05, available: true};

		this.setState({step04: current, step05: next});
	}

	/** Handle user clicks on the TriggerEvent button (send request to client host) */
	private handleRequestTriggerEventClick = () => {
		var current: ScenarioStepInfo = {...this.state.step06, completed: true};
		var next: ScenarioStepInfo = {...this.state.step07, available: true};

		this.setState({step06: current, step07: next});
	}

	/** Handle user clicks on the CleanUp button (delete Subscription from FHIR Server, Endpoint from ClientHost) */
	private handleCleanUpClick = () => {

	}
	
	/** Process HTML events for the patient filter text box (update state for managed) */
  private handlePatientFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({patientFilter: event.target.value})
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
