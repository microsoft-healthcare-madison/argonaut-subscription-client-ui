import * as React from 'react';

import { 
  IconName,
  Toaster,
  Position,
  IToasterProps,
  IToaster,
} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';

import {ConfigurationPane} from './ConfigurationPane';
import {Scenario1Pane} from './Scenario1Pane';
import {Scenario2Pane} from './Scenario2Pane';
import { UiTabInformation } from '../models/UiTabInformation';
import { MainNavigation } from './MainNavigation';
import { ConnectionInformation } from '../models/ConnectionInformation';
// import { TriggerPane } from './TriggerPane';

/** tab configuration - MUST be in 'id' order - first tab is shown at launch */
let _tabs: UiTabInformation[] = [
  {title: 'Config', tip: 'Configure Settings and Servers', id: '0', panel: React.createFactory(ConfigurationPane)},
  {title: 'One', tip:'Single Patient to REST-Hook', id: '1', panel: React.createFactory(Scenario1Pane)},
  {title: 'Two', tip:'Patient Group to REST-Hook', id: '2', panel: React.createFactory(Scenario2Pane)},
  // {title: 'Trigger', tip:'Manual trigger events', id: '3', panel: React.createFactory(TriggerPane)},
]

/** Type definition for the current object's state variable */
interface ComponentState {
  selectedNavbarTabId: string;
  fhirServerInfo: ConnectionInformation;
  clientHostInfo: ConnectionInformation;
  uiDark: boolean;
  codePaneDark: boolean;
}

export interface MainPageProps {}

export class MainPage extends React.PureComponent<MainPageProps> {
  public state: ComponentState = {
      selectedNavbarTabId: _tabs[0].id,
      fhirServerInfo: {
          name: 'FHIR Server', 
          hint: 'URL for an R4 FHIR Server with Subscription and Topic support',
          url: 'http://localhost:56340/baseR4/', 
          status: '', 
          showMessages: false,
          logMessages: false,
          registration: '',
        },
      clientHostInfo: {
        name: 'Client Host', 
        hint: 'URL for a running argonaut-client-host service',
        url: 'http://localhost:56345/', 
        status: '', 
        showMessages: false,
        logMessages: false,
        registration: '',
      },
      uiDark: false,
      codePaneDark: false,
  };

  /** WebSocket object for communicating with the client host */
  private _clientHostWebSocket: WebSocket | null = null;

  /** Callback function in the active pane to handle WebSocket ClientHost notifications */
  private _paneHostMessageHandler: ((message: string) => void) | null = null;

  /** Toaster display object */
  private _toaster: IToaster|null = null;

  // constructor(props: MainPageProps) {
  //   super(props);
  // }

  public render() {
    return (
      <div>
        {/* Render the navigation bar */}
        <MainNavigation 
          selectedTabId={this.state.selectedNavbarTabId} 
          tabs={_tabs} 
          onSelectedTabChanged={this.onSelectedTabChanged}
          fhirServerInfo={this.state.fhirServerInfo}
          clientHostInfo={this.state.clientHostInfo}
          />

        {/* Render the correct content pane, as selected in our tabs above */}
        { _tabs[Number(this.state.selectedNavbarTabId)].panel({
          fhirServerInfo: this.state.fhirServerInfo,
          clientHostInfo: this.state.clientHostInfo,
          updateFhirServerInfo: this.updateFhirServerInfo,
          updateClientHostInfo: this.updateClientHostInfo,
          connectClientHostWebSocket: this.connectToClientHostWebSocket,
          registerHostMessageHandler: this.registerPaneClientHostMessageHandler,
          toaster: this.showToastMessage,
          uiDark: this.state.uiDark,
          toggleUiColors: this.toggleUiColors,
          codePaneDark: this.state.codePaneDark,
          toggleCodePaneColors: this.toggleCodePaneColors,
        }) }

      </div>
    );
  }

  private toggleUiColors = () => {
    // **** update DOM elements ****

    var rootElement: HTMLElement = document.getElementById("root")!;
    rootElement.className = rootElement.className === 'bp3-dark' ? '' : 'bp3-dark';

    document.body.className = document.body.className === 'body-dark' ? '' : 'body-dark';

    // **** update state ****

    this.setState({uiDark: !this.state.uiDark});
  }

  private toggleCodePaneColors = () => {
    this.setState({codePaneDark: !this.state.codePaneDark});
  }

  /** Callback function to allow panes to register to receive client host notifications (max: 1) */
  private registerPaneClientHostMessageHandler = (handler: ((message: string) => void)) => {
    this._paneHostMessageHandler = handler;
  }

  /** Function to process client host messages received via the WebSocket */
  private clientHostMessageHandler = (event: MessageEvent) => {
    // **** display to user (if desired) ****

    if (this.state.clientHostInfo.showMessages) {
      this.showToastMessage(event.data, IconNames.CLOUD_DOWNLOAD, 2000);
    }

    // **** log to the console (if desired) ****

    if (this.state.clientHostInfo.logMessages) {
      console.log('ClientHost:', event.data);
    }

    // **** propagate (if necessary) ****

    if (this._paneHostMessageHandler !== null) {
      this._paneHostMessageHandler(event.data);
    }
  }
  
  /** Function to display a short-lived message on the main UI */
  private showToastMessage = (message: string, iconName?: IconName, timeout?: number) => {
    let toaster: IToaster = this.getOrCreateToaster();
    toaster.show({message: message, icon: iconName, timeout: timeout});
  }

  /** Function to either get the current Toast (short message) object, or create a new one */
  private getOrCreateToaster = () => {
    if (!this._toaster) {
      // **** configure our toaster display ****

      var toasterProps: IToasterProps = {
        autoFocus: false,
        canEscapeKeyClear: true,
        position: Position.TOP,
      }

      // **** static create the toaster on the DOM ****
      this._toaster = Toaster.create(toasterProps, document.body);
    }

    return this._toaster;
  }

  /** Callback function to allow panes to update the FHIR Server info */
  private updateFhirServerInfo = (updatedInfo: ConnectionInformation) => {
    this.setState({fhirServerInfo: updatedInfo});
  }

  /** Callback function to allow panes to update the Client Host info */
  private updateClientHostInfo = (updatedInfo: ConnectionInformation) => {

    // **** close any existing Client Host websocket connections  ****

    if ((updatedInfo.status !== 'ok') && (this._clientHostWebSocket)) {
      this._clientHostWebSocket.onmessage = null;
      this._clientHostWebSocket.close();
      this._clientHostWebSocket = null;
    }

    // **** update our state ****

    this.setState({clientHostInfo: updatedInfo});
  }

  /** Callback handler for when MainNavigation changes the active tab */
  private onSelectedTabChanged = (id: string) => {
    this.setState({selectedNavbarTabId: id});
  }

  /** Function to connect a ClientHost WebSocket to the specified host (max: 1) */
  private connectToClientHostWebSocket = (clientHostInfo: ConnectionInformation) => {
    // **** close any existing Client Host websocket connections  ****

    if (this._clientHostWebSocket) {
      this._clientHostWebSocket.onmessage = null;
      this._clientHostWebSocket.close();
      this._clientHostWebSocket = null;
    }

    // **** build the websocket URL ****

    let wsUrl: URL = new URL('/websockets?uid='+clientHostInfo.registration, clientHostInfo.url.replace('http', 'ws'));

    // **** connect to our server ****

    this._clientHostWebSocket = new WebSocket(wsUrl.toString());

    // **** setup our receive handler ****

    this._clientHostWebSocket.onmessage = this.clientHostMessageHandler;

    // **** setup an error handler to disconnect ****

    this._clientHostWebSocket.onerror = this.handleClientHostWebSocketError;
    this._clientHostWebSocket.onclose = this.handleClientHostWebSocketClose;

    // **** tell the user we are connected ****

    this.showToastMessage('Connected to Client Host', IconNames.INFO_SIGN, 3000);
  }

  private handleClientHostWebSocketError = (event: Event) => {
    // **** close our websocket ****

    var updatedInfo: ConnectionInformation = {...this.state.clientHostInfo, 
      status: ''
    };
    this.updateClientHostInfo(updatedInfo);

    // **** warn the user ****

    this.showToastMessage('Communication Error with Client Host', IconNames.ERROR, 5000);
  }

  private handleClientHostWebSocketClose = (event: Event) => {
    // **** close our websocket ****

    var updatedInfo: ConnectionInformation = {...this.state.clientHostInfo, 
      status: ''
    };
    this.updateClientHostInfo(updatedInfo);

    // **** warn the user ****

    this.showToastMessage('Disconnected from Client Host', IconNames.INFO_SIGN, 3000);
  }
}
