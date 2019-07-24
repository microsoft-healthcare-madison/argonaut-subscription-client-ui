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
  Icon,
  InputGroup,
  Intent,
  FormGroup,
  Elevation,
  UL,
  Text,
  H1, H2, H3, H4, H5, Spinner, Popover
} from '@blueprintjs/core';

import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../models/ContentPaneProps';
import { ScenarioStepInfo } from '../models/ScenarioStepInfo';
import { ScenarioStep } from './ScenarioStep';

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

		this.checkIfConnected(props, false);
	}

	componentDidMount() {
		this.checkIfConnected(this.props, true);
	}

  public render() {
    return (
      <Flex p={1} align='center' column>
        <Box px={1} w={1} m={1}>
          <Card elevation={Elevation.TWO}>
            <Text>
              <H3>Scenario 1 - (<a href='http://bit.ly/argo-sub-connectathon-2019-09#scenario-1' target='_blank'>Docs</a>)</H3>
              Patient Encounter notifications to a consumer app via REST-Hook
              {/* <UL>
                <li>(Optional) Client requests list of Topic resources from the server.</li>
                <li>View list of returned Topic resources</li>
                <li>User enteres Patient information to filter the Subscription</li>
                <li>UI asks Client Host to create a REST endpoint to receive notifications on</li>
                <li>UI builds Subscription object</li>
                <li>UI sends Subscription request to Server, should receive status: 'requested'</li>
                <li>Client Host will receive handshake, should notify UI</li>
                <li>UI asks Client Host to trigger a notification</li>
                <li>Client Host Endpoint receives notification</li>
                <li>Client Host notifies UI of received notification</li>
							</UL> */}
							
							{this.showNotConnectedWarning(this.state.connected)}
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

	private showSpinnerIfWaiting(step: ScenarioStepInfo) {
		if (step.available && !step.completed) {
			return <Spinner size={Spinner.SIZE_STANDARD} />;
		}
		return null;
	}

	private handleGetTopicListClick = () => {

	}

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

		this.setState({step02: current, step03: next});
	}

	private handleClientHostCreateEndpointClick = () => {
		var current: ScenarioStepInfo = {...this.state.step03, completed: true};
		var next: ScenarioStepInfo = {...this.state.step04, available: true};

		this.setState({step03: current, step04: next});
	}

	private handleRequestSubscriptionClick = () => {
		var current: ScenarioStepInfo = {...this.state.step04, completed: true};
		var next: ScenarioStepInfo = {...this.state.step05, available: true};

		this.setState({step04: current, step05: next});
	}

	private handleRequestTriggerEventClick = () => {
		var current: ScenarioStepInfo = {...this.state.step06, completed: true};
		var next: ScenarioStepInfo = {...this.state.step07, available: true};

		this.setState({step06: current, step07: next});
	}

	private handleCleanUpClick = () => {

	}
	
  private handlePatientFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({patientFilter: event.target.value})
  }

	private showNotConnectedWarning = (connected: boolean) => {
		if (connected) {
			return null;
		}

		return (
			<H5 style={{ display: 'flex', justifyContent: 'center', marginTop: 15 }}>
				<Icon icon={IconNames.WARNING_SIGN} intent={Intent.DANGER} iconSize={Icon.SIZE_LARGE} />
				&nbsp;&nbsp;
				You MUST connect to a FHIR Server and Client Host before running this scenario!
				&nbsp;&nbsp;
				<Icon icon={IconNames.WARNING_SIGN} intent={Intent.DANGER} iconSize={Icon.SIZE_LARGE} />
			</H5>
			);
	}
	
	private checkIfConnected = (nextProps: ContentPaneProps, useSetState: boolean) => {
		var step01: ScenarioStepInfo = {...this.state.step01};
		var step02: ScenarioStepInfo = {...this.state.step02};
		var connected: boolean = false;

		// **** check to make sure we are connected to the server and host ****

		if ((this.props.clientHostInfo.status != 'ok') || (this.props.fhirServerInfo.status != 'ok')) {
			step01.available = false;
			step02.available = false;
			connected = false;
		} else {
			step01.available = true;
			step02.available = true;
			connected = true;
		}

		// **** update state (if necessary) ****

		if ((step01.available != this.state.step01.available) ||
				(step02.available != this.state.step02.available)) {
			
			// **** check if we are using setState (cannot be used from constructor) ****

			if (useSetState) {
				this.setState({step01: step01, step02: step02, connected: connected});
			} else {
				this.state.step01 = step01;
				this.state.step02 = step02;
				this.state.connected = connected;
			}
		}
	}

}
