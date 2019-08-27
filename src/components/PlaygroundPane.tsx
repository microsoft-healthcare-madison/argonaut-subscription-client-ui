import * as React from 'react';

import {
  Card,
	Button,
  InputGroup,
  FormGroup,
  Elevation,
  Text,
  H3, Spinner, NonIdealState, Tabs, Tab, ControlGroup, HTMLSelect, TabId, H6, RadioGroup, Radio
} from '@blueprintjs/core';

import {DateInput} from '@blueprintjs/datetime';

import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../models/ContentPaneProps';
import { DataCardInfo } from '../models/DataCardInfo';
import { ScenarioStep } from './ScenarioStep';
import { EndpointRegistration, EndpointChannelType } from '../models/EndpointRegistration';
import { ApiHelper } from '../util/ApiHelper';
import * as fhir from '../models/fhir_r4_selected';
import { SubscriptionTile, SubscriptionTileData } from './SubscriptionTile';
import { NotificationsTile } from './NotificationsTile';


interface ComponentState {
  connected: boolean,
  notifications: fhir.Bundle[],
  subscriptions: SubscriptionTileData[],
}

export class PlaygroundPane extends React.PureComponent<ContentPaneProps> {
  public state: ComponentState = {
    connected: false,
    notifications: [],
    subscriptions: [],
  }

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
						description='You must be connected to a FHIR Server and Client Host before interacting with the Playground.'
						/>
				</Card>
			);
    }
    
    return ([

      <Card key='title' elevation={Elevation.TWO} style={{margin: 5}}>
        <Text>
          <H3>Welcome to the Playgound!</H3>
          There are many functions here to test Subscriptions and Topics.
          If there is functionality you need that is not present, please let us know.
        </Text>
      </Card>,

      // <PlaygroundTile
      //   heading='Endpoints'
      //   description='Area to work with Endpoints'
      //   isBusy={true}
      //   data={[]}
      //   toaster={this.props.toaster}
      //   codePaneDark={this.props.codePaneDark}
      //   >
      // </PlaygroundTile>,

      <SubscriptionTile
        data={[]}
        paneProps={this.props}
        />,

      <NotificationsTile
        data={this.state.notifications}
        paneProps={this.props}
        />
      
    ]);
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