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
  NonIdealState,
} from '@blueprintjs/core';

import { ContentPaneProps } from '../models/ContentPaneProps';
import { ConnectionInformation } from '../models/ConnectionInformation';
import { ClientHostRegistration } from '../models/ClientHostRegistration';
import { ApiHelper } from '../util/ApiHelper';
import { IconNames } from '@blueprintjs/icons';

/** Type definition for the current object's state variable */
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
  }

  componentDidMount() {

    var serverConnected: boolean = false;
    
    if (this.props.fhirServerInfo.status === 'ok') {
      serverConnected = true;
    }

    var clientConnected: boolean = false;

    if (this.props.clientHostInfo.status === 'ok') {
      clientConnected = true;
    }

    this.setState({fhirServerConnected: serverConnected, clientHostConnected: clientConnected});
	}

  public render() {
    return (
      <Flex p={1} align='center' column>
        <Box px={1} w={1} m={1}>
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

            <Button
              onClick={this.handleConnectClick}
              intent={this.state.clientHostConnected ? Intent.WARNING : Intent.PRIMARY}
              style={{margin: 5}}
              >
              {this.state.clientHostConnected ? 'Disconnect' : 'Connect'}
            </Button>
            {/* {this.props.clientHostInfo.status === 'ok' ? 'Connected' : 'Not Connected'} */}

          </Card>
        </Box>
      </Flex>
    );
  }

	/** Process HTML events for the FHIR Server URL text box (update state for managed) */
  private handleFhirServerUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({fhirServerUrl: event.target.value})
  }

	/** Process HTML events for the Client Host URL text box (update state for managed) */
  private handleClientHostUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({clientHostUrl: event.target.value})
  }

  /** Conect to a FHIR Server and Client Host */
  private handleConnectClick = () => {
    // **** if we are connected to a client, we need to disconnect ****

    if (this.state.clientHostConnected) {
      // **** disconnect from the server ****

      this.disconnectServer();

      // **** disconnect from the client host ****

      this.disconnectClientHost();

      // **** done ****

      return;
    }

    // **** connect to the server ****

    this.connectServer();

    // **** connect to the client ****

    this.connectClientHost();
  }

  private disconnectServer = () => {
    var updatedInfo: ConnectionInformation = {...this.props.fhirServerInfo, 
      status: ''
    };
    this.props.updateFhirServerInfo(updatedInfo);

    // **** disconnected from server ****

    this.setState({fhirServerConnected: false});
  }

  private disconnectClientHost = () => {
    var updatedInfo: ConnectionInformation = {...this.props.clientHostInfo, 
      status: ''
    };
    this.props.updateClientHostInfo(updatedInfo);

    // **** disconnected from client host ****

    this.setState({clientHostConnected: false});
  }

  private connectServer = () => {
    // **** flag we are attempting to connect to the server ****

    this.setState({fhirServerConnecting: true});

    var updatedInfo: ConnectionInformation = {...this.props.fhirServerInfo, 
      url: this.state.fhirServerUrl,
      status: 'ok'
    };
    this.props.updateFhirServerInfo(updatedInfo);

    // **** connected to the server ****

    this.setState({fhirServerConnected: true});
  }

  private connectClientHost = () => {
    // **** try to connect to the client ****

    this.setState({fhirServerConnected: true, clientHostConnecting: true});

    // **** construct the registration REST url ****

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

}
