import * as React from 'react';

import { 
  Flex, 
  Box 
} from 'reflexbox';

import { 
  Card,
  Button, 
  Collapse,
  Icon,
  InputGroup,
  Intent,
  FormGroup,
  Elevation,
} from '@blueprintjs/core';

import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../models/ContentPaneProps';
import { ConnectionInformation } from '../models/ConnectionInformation';
import { ClientHostRegistration } from '../models/ClientHostRegistration';
import { ApiHelper } from '../util/ApiHelper';

interface ComponentState {
  fhirServerUrl: string;
  fhirServerConnecting: boolean;
  fhirServerConnected: boolean;
  fhirServerMessage: string;
  
  clientHostUrl: string;
  clientHostConnecting: boolean;
  clientHostConnected: boolean;
  clientHostMessage: string;
}

export class ConfigurationPane extends React.PureComponent<ContentPaneProps> {
  public state: ComponentState = {
      fhirServerUrl: '',
      fhirServerConnecting: false,
      fhirServerConnected: false,
      fhirServerMessage: '',

      clientHostUrl: '',
      clientHostConnecting: false,
      clientHostConnected: false,
      clientHostMessage: '',
  };

  constructor(props: ContentPaneProps) {
    super(props);
    
    this.state.fhirServerUrl = props.fhirServerInfo.url;
    this.state.clientHostUrl = props.clientHostInfo.url;

    if (props.fhirServerInfo.status === 'ok') {
      this.state.fhirServerConnected = true;
    }

    if (props.clientHostInfo.status === 'ok') {
      this.state.clientHostConnected = true;
    }
  }

  public render() {
    return (
      <Flex p={1} align='center' column>
        <Box px={1} w={1}>
          <Card elevation={Elevation.TWO}>
            <FormGroup
              label = {this.props.fhirServerInfo.name + ' URL'}
              helperText = {this.props.fhirServerInfo.hint}
              labelFor='fhir-server-url'
              >
              <InputGroup 
                id='fhir-server-url'
                value={this.state.fhirServerUrl}
                onChange={this.handleFhirServerUrlChange}
                />
            </FormGroup>

            <p>
              <Button
                onClick={this.handleTestFhirServerClick}
                >
                Test FHIR Server
              </Button>
            </p>

            <FormGroup
              label = {this.props.clientHostInfo.name + ' URL'}
              helperText = {this.props.clientHostInfo.hint}
              labelFor='fhir-client-url'
              >
              <InputGroup 
                id='fhir-client-url'
                value={this.state.clientHostUrl}
                onChange={this.handleClientHostUrlChange}
                />
            </FormGroup>

            <p>
              <Button
                onClick={this.handleConnectToClientHostClick}
                >
                Connect to Client Host
              </Button>
            </p>

          </Card>
        </Box>
      </Flex>
    );
  }

  private handleFhirServerUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({fhirServerUrl: event.target.value})
  }

  private handleClientHostUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({clientHostUrl: event.target.value})
  }

  private handleConnectToClientHostClick = () => {

    // **** flag we are attempting to connect ****

    this.setState({clientHostConnecting: true});

    let registrationUrl: URL = new URL('/api/ClientRegistration/', this.state.clientHostUrl);

    // **** attempt to register ourself as a client ****

    var clientHostRegistration: ClientHostRegistration = {uid: '', fhirServerUrl: this.state.fhirServerUrl};

    ApiHelper.apiPost<ClientHostRegistration>(registrationUrl.toString(), JSON.stringify(clientHostRegistration))
      .then((value: ClientHostRegistration) => {
        // **** build a new client host info object ****

        let updatedClientInfo: ConnectionInformation = {...this.props.clientHostInfo, 
          url: this.state.clientHostUrl,
          registration: value.uid,
          status: 'ok',
        };

        // **** attempt to connect our websocket ****

        this.props.connectClientHostWebSocket(updatedClientInfo);

        // **** update our parent ****

        this.props.updateClientHostInfo(updatedClientInfo);

        // **** flag we are done ****

        this.setState({clientHostConnecting: false, clientHostConnected: true});
      })
      .catch((reason: any) => {
        // **** error ****

        this.setState({clientHostConnecting: false, clientHostConnected: false, clientHostMessage: 'Could not register with Client Host'});
      })
      ;
  }

  private handleTestFhirServerClick = () => {
    var updatedInfo: ConnectionInformation = {...this.props.fhirServerInfo, 
      url: this.state.fhirServerUrl,
      status: 'ok'
    };
    this.props.updateFhirServerInfo(updatedInfo);
  }
}
