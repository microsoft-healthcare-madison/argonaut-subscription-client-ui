import React, {useState, useEffect, useRef} from 'react';

import {
  IconName,
  Toaster,
  Position,
  IToasterProps,
  IToaster,
} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';

import ConfigurationPane from './ConfigurationPane';
import Scenario2Pane from './Scenario2Pane';
import { UiTabInformation } from '../models/UiTabInformation';
import MainNavigation from './MainNavigation';
import { ConnectionInformation } from '../models/ConnectionInformation';
import { StorageHelper } from '../util/StorageHelper';
import PlaygroundPane  from './playground/PlaygroundPane';
import { CopyHelper } from '../util/CopyHelper';
import ScenarioPane1 from './scenario1/ScenarioPane1';
import { ApiHelper } from '../util/ApiHelper';
import { ClientHostRegistration } from '../models/ClientHostRegistration';

/** tab configuration - MUST be in 'id' order - first tab is shown at launch */
let _tabs: UiTabInformation[] = [
  {title: 'Config', tip: 'Configure Settings and Servers', id: '0', panel: React.createFactory(ConfigurationPane)},
  {title: 'Patient+REST', tip:'Single Patient to REST-Hook', id: '1', panel: React.createFactory(ScenarioPane1)},
  {title: 'Group+REST', tip:'Patient Group to REST-Hook', id: '2', panel: React.createFactory(Scenario2Pane)},
  {title: 'Playground', tip:'Playground for testing Subscriptions', id: '3', panel: React.createFactory(PlaygroundPane)},
]

// **** extend the Window to include our _env settings ****

declare global {
  interface Window { _env?:any }
}

// **** export whatever our property type is ****

export interface MainPageProps {}

// **** this component ****

export default function MainPage() {
  // **** set up local state ****

  const initialLoadRef = useRef<boolean>(true);
  const _clientHostWebSocketRef = useRef<WebSocket | null>(null);
  const _paneHostMessageHandlerRef = useRef<((message: string) => void) | null>(null);
  const _toasterRef = useRef<IToaster | null>(null);

  const [selectedNavbarTabId, setSelectedNavbarTabId] = useState<string>(_tabs[0].id);
  const [fhirServerInfo, setFhirServerInfo] = useState<ConnectionInformation>({
      name: 'FHIR Server',
      hint: 'URL for an R4 FHIR Server with Subscription and Topic support',
      url: window._env.Server_Public_Url,
      status: '',
      showMessages: false,
      logMessages: false,
      registration: '',
    });
  const [clientHostInfo, setClientHostInfo] = useState<ConnectionInformation>({
      name: 'Client Host',
      hint: 'URL for a running argonaut-client-host service - creates endpoints and forwards notifications to this UI',
      url: window._env.Client_Public_Url,
      status: '',
      showMessages: false,
      logMessages: false,
      registration: '',
    });
  const [uiDark, setUiDark] = useState<boolean>(false);
  const [codePaneDark, setCodePaneDark] = useState<boolean>(false);

  // **** handle lifecycle changes ****

  useEffect(() => {
    // **** check for initial load ****

    if (initialLoadRef.current) {
        // **** check for local storage settings ****

      if (StorageHelper.isLocalStorageAvailable) {
        // **** update local settings ****

        if (localStorage.getItem('fhirServerUrl')) {
          setFhirServerInfo({...fhirServerInfo, url: localStorage.getItem('fhirServerUrl')!});
        }

        let clientInfo = {...clientHostInfo};

        if (localStorage.getItem('clientHostUrl')) {
          clientInfo.url = localStorage.getItem('clientHostUrl')!;
        }

        if (localStorage.getItem('showMessages') === 'true') {
          clientInfo.showMessages = true;
        }

        if (localStorage.getItem('logMessages') === 'true') {
          clientInfo.logMessages = true;
        }

        setClientHostInfo(clientInfo);

        if (localStorage.getItem('uiDark') === 'true') {
          setUiDark(true);
        }

        if (localStorage.getItem('codePaneDark') === 'true') {
          setCodePaneDark(true);
        }
      }

      // **** no longer initial load ****

      initialLoadRef.current = false;
    }
  }, [clientHostInfo, fhirServerInfo]);

  /** Function to toggle the UI colors (light/dark) */
  function toggleUiColors() {
    setUiDark(!uiDark);
  };
  useEffect(() => {
    var rootElement: HTMLElement = document.getElementById("root")!;

    if (uiDark) {
      // **** update DOM elements ****

      // rootElement.className = rootElement.className === 'bp3-dark' ? '' : 'bp3-dark';
      if (rootElement.className !== 'bp3-dark') {
        rootElement.className = 'bp3-dark';
      }
      // document.body.className = document.body.className === 'body-dark' ? '' : 'body-dark';
      if (document.body.className !== 'body-dark') {
        document.body.className = 'body-dark';
      }

      if (StorageHelper.isLocalStorageAvailable) {
        localStorage.setItem('uiDark', (uiDark).toString());
      }

      return;
    }

    // **** update DOM elements ****

    // rootElement.className = rootElement.className === 'bp3-dark' ? '' : 'bp3-dark';
    if (rootElement.className === 'bp3-dark') {
      rootElement.className = '';
    }
    // document.body.className = document.body.className === 'body-dark' ? '' : 'body-dark';
    if (document.body.className === 'body-dark') {
      document.body.className = '';
    }

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('uiDark', (uiDark).toString());
    }
    
  }, [uiDark]);

  /** Function to toggle the code pane colors (light/dark) */
  function toggleCodePaneColors() {
    setCodePaneDark(!codePaneDark);
  };
  useEffect(() => {
    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('codePaneDark', (codePaneDark).toString());
    }
  }, [codePaneDark]);

  /** Disconnect from all connected servers */
  function disconnect() {
    if (_clientHostWebSocketRef.current) {
      _clientHostWebSocketRef.current.onmessage = null;
      _clientHostWebSocketRef.current.close();
      _clientHostWebSocketRef.current = null;
    }

    if (clientHostInfo.registration) {
      // **** construct the registration REST url ****

      let url: string = new URL(
        `api/Clients/${clientHostInfo.registration}/`,
        clientHostInfo.url
        ).toString();

      // **** unregister this client ****

      ApiHelper.apiDelete(url);
    }
    setClientHostInfo({...clientHostInfo, registration: '', status: ''});
    setFhirServerInfo({...fhirServerInfo, status: ''});
  }

  /** Connect to a client host and fhir server and update local information */
  function connect(
      fhirServer: ConnectionInformation, 
      clientHost: ConnectionInformation,
      completionHandler: ((success: boolean) => void)
      ) {
    // **** close any existing Client Host websocket connections  ****

    if (clientHostInfo.status !== '') {
      disconnect();
    }

    // **** for now, just say that the fhir server is connected ****

    let updatedFhirServer: ConnectionInformation = {...fhirServer, status: 'ok'};
    setFhirServerInfo(updatedFhirServer);

    // **** construct the registration REST url ****

    let registrationUrl: URL = new URL('api/Clients/', clientHost.url);

    // **** attempt to register ourself as a client ****

    var clientHostRegistration: ClientHostRegistration = {uid: '', fhirServerUrl: fhirServer.url};

    ApiHelper.apiPost<ClientHostRegistration>(registrationUrl.toString(), JSON.stringify(clientHostRegistration))
      .then((value: ClientHostRegistration) => {
        // **** update our client host information ****

        let updatedClientInfo: ConnectionInformation = {...clientHost, 
          registration: value.uid,
          status: 'ok',
        };

        // **** build the websocket URL ****

        let wsUrl: string = new URL(
          '/websockets?uid='+updatedClientInfo.registration,
          updatedClientInfo.url.replace('http', 'ws')).toString();

        // **** connect to our server ****

        _clientHostWebSocketRef.current = new WebSocket(wsUrl);

        // **** setup our receive handler ****

        _clientHostWebSocketRef.current.onmessage = clientHostMessageHandler;

        // **** setup an error handler to disconnect ****

        _clientHostWebSocketRef.current.onerror = handleClientHostWebSocketError;
        _clientHostWebSocketRef.current.onclose = handleClientHostWebSocketClose;

        // **** tell the user we are connected ****

        showToastMessage('Connected to Client Host', IconNames.INFO_SIGN, 3000);

        // **** update our client host info ****

        setClientHostInfo(updatedClientInfo);

        // **** flag we are done successfully ****

        if (completionHandler) {
          completionHandler(true);
        }
      })
      .catch((reason: any) => {
        if (completionHandler) {
          completionHandler(false);
        }
      })
      ;
  }

  function handleClientHostWebSocketError(event: Event) {
    // **** close our websocket ****

    var updatedInfo: ConnectionInformation = {...clientHostInfo,
      status: ''
    };
    setClientHostInfo(updatedInfo);

    // **** warn the user ****

    showToastMessage('Communication Error with Client Host', IconNames.ERROR, 5000);
  }

  /** Handler to process web socket close events */
  function handleClientHostWebSocketClose(event: Event) {
    // **** close our websocket ****

    var updatedInfo: ConnectionInformation = {...clientHostInfo,
      status: ''
    };
    setClientHostInfo(updatedInfo);

    // **** warn the user ****

    showToastMessage('Disconnected from Client Host', IconNames.INFO_SIGN, 3000);
  }

  /** Callback function to allow panes to register to receive client host notifications (max: 1) */
  function registerPaneClientHostMessageHandler(handler: ((message: string) => void)) {
    _paneHostMessageHandlerRef.current = handler;
  }

  /** Function to process client host messages received via the WebSocket */
  function clientHostMessageHandler(event: MessageEvent) {
    // **** check for keepalive message (discard) ****

    if ((event.data) && ((event.data as string).startsWith('keepalive'))) {
      // console.log('Recevied keepalive on ClientHost WebSocket', event.data);
      return;
    }
    // **** display to user (if desired) ****

    if (clientHostInfo.showMessages) {
      showToastMessage(event.data, IconNames.CLOUD_DOWNLOAD, 2000);
    }

    // **** log to the console (if desired) ****

    if (clientHostInfo.logMessages) {
      console.log('ClientHost:', event.data);
    }

    // **** propagate (if necessary) ****

    if (_paneHostMessageHandlerRef.current) {
      _paneHostMessageHandlerRef.current!(event.data);
    }
  }

  /** Function to display a short-lived message on the main UI */
  function showToastMessage(message: string, iconName?: IconName, timeout?: number) {
    let toaster: IToaster = getOrCreateToaster();
    toaster.show({message: message, icon: iconName, timeout: timeout});
  }

  /** Function to either get the current Toast (short message) object, or create a new one */
  function getOrCreateToaster() {
    if (!_toasterRef.current) {
      // **** configure our toaster display ****

      var toasterProps: IToasterProps = {
        autoFocus: false,
        canEscapeKeyClear: true,
        position: Position.TOP,
      }

      // **** static create the toaster on the DOM ****
      _toasterRef.current = Toaster.create(toasterProps, document.body);
    }

    return _toasterRef.current;
  }

  /** Function to perform copying generic text to the clipboard */
  function copyToClipboard(message: string, toast?: string) {

    // **** attempt the copy ****

    const success = CopyHelper.copyToClipboard(message);

    // **** notify the user ****

    if ((success) && (toast)) {
      showToastMessage(toast, IconNames.CLIPBOARD);
    }

    if ((!success) && (toast)) {
      showToastMessage('Failed to copy!', IconNames.WARNING_SIGN);
    }
  }

  /** Render function */
  return (
    <div>
      {/* Render the navigation bar */}
      <MainNavigation
        selectedTabId={selectedNavbarTabId}
        tabs={_tabs}
        onSelectedTabChanged={setSelectedNavbarTabId}
        fhirServerInfo={fhirServerInfo}
        clientHostInfo={clientHostInfo}
        />
      {/* <div id='mainContent'> */}
        {/* Render the correct content pane, as selected in our tabs above */}
        { _tabs[Number(selectedNavbarTabId)].panel({
          fhirServerInfo: fhirServerInfo,
          updateFhiServerInfo: setFhirServerInfo,
          clientHostInfo: clientHostInfo,
          updateClientInfo: setClientHostInfo,
          connect: connect,
          disconnect: disconnect,
          registerHostMessageHandler: registerPaneClientHostMessageHandler, //setPaneHostMessageHandler,
          toaster: showToastMessage,
          uiDark: uiDark,
          toggleUiColors: toggleUiColors,
          codePaneDark: codePaneDark,
          toggleCodePaneColors:toggleCodePaneColors,
          copyToClipboard: copyToClipboard,
        }) }
      {/* </div> */}
    </div>
  );
}