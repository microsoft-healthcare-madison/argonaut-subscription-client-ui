import * as React from 'react';

import { 
  Card,
  Button, 
  InputGroup,
  Intent,
  FormGroup,
  Elevation,
  Switch,
} from '@blueprintjs/core';

import { ContentPaneProps } from '../models/ContentPaneProps';
import { ConnectionInformation } from '../models/ConnectionInformation';
import { ClientHostRegistration } from '../models/ClientHostRegistration';
import { ApiHelper } from '../util/ApiHelper';
import { StorageHelper } from '../util/StorageHelper';

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

    this.state.fhirServerConnected = props.fhirServerInfo.status === 'ok';
    this.state.clientHostConnected = props.clientHostInfo.status === 'ok';
  }

  componentWillReceiveProps(nextProps: ContentPaneProps) {
    var serverConnected: boolean = false;
    
    if (nextProps.fhirServerInfo.status === 'ok') {
      serverConnected = true;
    }

    var clientConnected: boolean = false;

    if (nextProps.clientHostInfo.status === 'ok') {
      clientConnected = true;
    }

    if ((serverConnected !== this.state.fhirServerConnected) || 
        (clientConnected !== this.state.clientHostConnected)) {
      this.setState({fhirServerConnected: serverConnected, clientHostConnected: clientConnected});
    }
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
            disabled={this.state.clientHostConnected}
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
            disabled={this.state.clientHostConnected}
            />
        </FormGroup>

        <Button
          onClick={this.handleConnectClick}
          intent={this.state.clientHostConnected ? Intent.WARNING : Intent.PRIMARY}
          key={'ConnectButton_'+this.props.clientHostInfo.status}
          >
          {this.state.clientHostConnected ? 'Disconnect' : 'Connect'}
        </Button>
        {/* {this.props.clientHostInfo.status === 'ok' ? 'Connected' : 'Not Connected'} */}


        <Switch
          checked={this.props.clientHostInfo.showMessages}
          label='Display Client Host Messages'
          onChange={this.handleToggleShowClientHostMessages}
          />
        
        <Switch
          checked={this.props.clientHostInfo.logMessages}
          label='Console Log Client Host Messages'
          onChange={this.handleToggleLogClientHostMessages}
          />
        
        <Switch
          checked={this.props.uiDark}
          label='Use Dark Theme for UI'
          onChange={() => this.props.toggleUiColors(true)}
          />

        <Switch
          checked={this.props.codePaneDark}
          label='Use Dark Theme for Code Pane'
          onChange={() => this.props.toggleCodePaneColors(true)}
          />
          
      </Card>
    );
  }

  /** Event handler for toggling the Show Client Host Messages switch */
  private handleToggleShowClientHostMessages = () => {
    var updatedInfo: ConnectionInformation = {...this.props.clientHostInfo, 
      showMessages: !this.props.clientHostInfo.showMessages
    };
    this.props.updateClientHostInfo(updatedInfo);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('showMessages', updatedInfo.showMessages.toString());
    }
  }

  /** Event handler for toggling the Log Client Host Messages switch */
  private handleToggleLogClientHostMessages = () => {
    var updatedInfo: ConnectionInformation = {...this.props.clientHostInfo, 
      logMessages: !this.props.clientHostInfo.logMessages
    };
    this.props.updateClientHostInfo(updatedInfo);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('logMessages', updatedInfo.logMessages.toString());
    }
  }

	/** Process HTML events for the FHIR Server URL text box (update state for managed) */
  private handleFhirServerUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({fhirServerUrl: event.target.value})

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('fhirServerUrl', event.target.value);
    }
  }

	/** Process HTML events for the Client Host URL text box (update state for managed) */
  private handleClientHostUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({clientHostUrl: event.target.value})

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('clientHostUrl', event.target.value);
    }
  }

  /** Conect to a FHIR Server and Client Host */
  private handleConnectClick = () => {
    // **** if we are connected to a client, we need to disconnect ****

    if (this.state.clientHostConnected) {
      // **** disconnect from the server ****

      this.disconnectServer();

      // **** disconnect from the client host ****

      this.disconnectClientHost();

      // **** flag we want to be disconnected ****

      if (StorageHelper.isLocalStorageAvailable) {
        localStorage.setItem('connectionRequested', false.toString());
      }
      // **** done ****

      return;
    }

    // **** connect to the server ****

    this.connectServer();

    // **** connect to the client ****

    this.connectClientHost();

    // **** flag we want to be connected ****

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('connectionRequested', true.toString());
    }
  }

  /** Disconnect our client from the connected FHIR Server */
  private disconnectServer = () => {

    // **** flag we are no longer connected to the fhir server ****

    var updatedInfo: ConnectionInformation = {...this.props.fhirServerInfo, 
      status: ''
    };
    this.props.updateFhirServerInfo(updatedInfo);

    // **** disconnected from server ****

    this.setState({fhirServerConnected: false});
  }

  /** Disconnect our client from the connected Client Host */
  private disconnectClientHost = () => {
    // **** construct the registration REST url ****

    let url: URL = new URL(`api/Clients/${this.props.clientHostInfo.registration}/`, this.state.clientHostUrl);

    // **** unregister this client ****

    ApiHelper.apiDelete(url.toString());
    
    // **** flag we are no longer connected to the client host ****

    var updatedInfo: ConnectionInformation = {...this.props.clientHostInfo, 
      status: ''
    };
    this.props.updateClientHostInfo(updatedInfo);

    // **** disconnected from client host ****

    this.setState({clientHostConnected: false});
  }

  /** Connect our client to a FHIR Server */
  private connectServer = () => {
    // **** flag we are attempting to connect to the server ****

    this.setState({fhirServerConnecting: true});

    var updatedInfo: ConnectionInformation = {...this.props.fhirServerInfo, 
      url: this.state.fhirServerUrl,
      status: 'ok'
    };
    this.props.updateFhirServerInfo(updatedInfo);

    // **** connected to the server ****

    this.setState({fhirServerConnecting: false, fhirServerConnected: true});
  }

  /** Connect our client to a Client Host (register and connect websocket) */
  private connectClientHost = () => {
    // **** try to connect to the client ****

    this.setState({clientHostConnecting: true});

    // **** construct the registration REST url ****

    let registrationUrl: URL = new URL('api/Clients/', this.state.clientHostUrl);

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
