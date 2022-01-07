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
import { UiTabInformation } from '../models/UiTabInformation';
import MainNavigation from './MainNavigation';
import { ConnectionInformation } from '../models/ConnectionInformation';
import { StorageHelper } from '../util/StorageHelper';
import PlaygroundPane  from './playground/PlaygroundPane';
import { CopyHelper } from '../util/CopyHelper';
import ScenarioPane1 from './scenario1/ScenarioPane1';
import EndpointScenarioPane1 from './endpointScenario1/EndpointScenarioPane1';
import ScenarioPane2 from './scenario2/ScenarioPane2';
import { ApiHelper, ApiResponse } from '../util/ApiHelper';
import { ClientHostRegistration } from '../models/ClientHostRegistration';

import * as fhir from 'fhir4';
import * as fhirCommon from '../models/fhirCommon';
import DevDaysPane from './devdays/DevDaysPane';

/** tab configuration - MUST be in 'id' order - first tab is shown at launch */
let _tabs: UiTabInformation[] = [
  {title: 'Config', tip: 'Configure Settings and Servers', id: '0', panel: React.createFactory(ConfigurationPane)},
  {title: 'Patient+REST Server', tip:'FHIR Server: Single Patient to REST-Hook', id: '1', panel: React.createFactory(ScenarioPane1)},
  {title: 'Patient+REST Endpoint', tip:'Endpoint: Single Patient to REST-Hook', id: '2', panel: React.createFactory(EndpointScenarioPane1)},
  {title: 'Group+REST', tip:'Patient Group to REST-Hook', id: '3', panel: React.createFactory(ScenarioPane2)},
  {title: 'Playground', tip:'Playground for testing Subscriptions', id: '4', panel: React.createFactory(PlaygroundPane)},
  // {title: 'DevDays', tip:'DevDays Amsterdam 2019', id: '4', panel: React.createFactory(DevDaysPane)},
]

// extend the Window to include our _env settings

declare global {
  interface Window { _env?:any }
}

// export whatever our property type is
export interface MainPageProps {}

// this component
export default function MainPage() {
  // set up local state
  const initialLoadRef = useRef<boolean>(true);
  const _clientHostWebSocketRef = useRef<WebSocket | null>(null);
  const _paneHostMessageHandlerRef = useRef<((message: string) => void) | null>(null);
  const _toasterRef = useRef<IToaster | null>(null);

  const [selectedNavbarTabId, setSelectedNavbarTabId] = useState<string>(_tabs[0].id);
  const [fhirServerInfoR4, setFhirServerInfoR4] = useState<ConnectionInformation>({
    name: 'FHIR R4 Server',
    hint: `URL for an FHIR Server with Subscription and SubscriptionTopic support. Default URL is: ${window._env.Server_Public_Url_R4}`,
    url: window._env.Server_Public_Url_R4,
    // proxyDestinationUrl: '',
    status: '',
    showMessages: false,
    logMessages: false,
    registration: '',
    authHeaderContent: '',
    preferHeaderContent: 'representation',
    websocketUrl: '',
  });
  const [fhirServerInfoR5, setFhirServerInfoR5] = useState<ConnectionInformation>({
    name: 'FHIR R5 Server',
    hint: `URL for an FHIR Server with Subscription and SubscriptionTopic support. Default URL is: ${window._env.Server_Public_Url_R5}`,
    url: window._env.Server_Public_Url_R5,
    // proxyDestinationUrl: '',
    status: '',
    showMessages: false,
    logMessages: false,
    registration: '',
    authHeaderContent: '',
    preferHeaderContent: 'representation',
    websocketUrl: '',
  });
  const [clientHostInfo, setClientHostInfo] = useState<ConnectionInformation>({
      name: 'Client Host',
      hint: `URL for a running argonaut-client-host service - creates endpoints and forwards notifications to this UI.  Default URL is: ${window._env.Client_Public_Url}`,
      url: window._env.Client_Public_Url,
      status: '',
      showMessages: false,
      logMessages: false,
      registration: '',
      authHeaderContent: '',
      preferHeaderContent: 'representation',
      websocketUrl: '',
    });
  const [uiDark, setUiDark] = useState<boolean>(false);
  const [codePaneDark, setCodePaneDark] = useState<boolean>(false);
  const [useBackportToR4, setUseBackportToR4] = useState<boolean>(false);
  const [skipCapabilitiesCheck, setSkipCapabilitesCheck] = useState<boolean>(false);

  // handle lifecycle changes
  useEffect(() => {
    // check for initial load
    if (initialLoadRef.current) {
        // check for local storage settings
      if (StorageHelper.isLocalStorageAvailable) {

        let serverInfoR4 = {...fhirServerInfoR4};

        // update local settings
        if (localStorage.getItem('fhirServerUrlR4')) {
          serverInfoR4.url= localStorage.getItem('fhirServerUrlR4')!;
        }

        if (localStorage.getItem('fhirServerAuthR4')) {
          serverInfoR4.authHeaderContent = localStorage.getItem('fhirServerAuthR4')!;
        }

        if (localStorage.getItem('fhirServerPreferR4')) {
          serverInfoR4.preferHeaderContent = localStorage.getItem('fhirServerPreferR4')!;
        }

        // if (localStorage.getItem('fhirServerProxyUrl')) {
        //   serverInfo.proxyDestinationUrl = localStorage.getItem('fhirServerProxyUrl')!;
        // }
        
        setFhirServerInfoR4(serverInfoR4);

        let serverInfoR5 = {...fhirServerInfoR5};

        // update local settings
        if (localStorage.getItem('fhirServerUrlR5')) {
          serverInfoR4.url= localStorage.getItem('fhirServerUrlR5')!;
        }

        if (localStorage.getItem('fhirServerAuthR5')) {
          serverInfoR4.authHeaderContent = localStorage.getItem('fhirServerAuthR5')!;
        }

        if (localStorage.getItem('fhirServerPreferR5')) {
          serverInfoR4.preferHeaderContent = localStorage.getItem('fhirServerPreferR5')!;
        }

        // if (localStorage.getItem('fhirServerProxyUrl')) {
        //   serverInfo.proxyDestinationUrl = localStorage.getItem('fhirServerProxyUrl')!;
        // }
        
        setFhirServerInfoR5(serverInfoR5);

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

        if (localStorage.getItem('useBackportToR4') === 'true') {
          setUseBackportToR4(true);
        }

        if (localStorage.getItem('skipCapabilitesCheck') === 'true') {
          setSkipCapabilitesCheck(true);
        }
      }

      // no longer initial load

      initialLoadRef.current = false;
    }
  }, [clientHostInfo, fhirServerInfoR4, fhirServerInfoR5]);

  /** Function to toggle the UI colors (light/dark) */
  function toggleUiColors() {
    setUiDark(!uiDark);
  };
  useEffect(() => {
    var rootElement: HTMLElement = document.getElementById("root")!;

    if (uiDark) {
      // update DOM elements

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

    // update DOM elements

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

  function toggleUseBackportToR4() {
    setUseBackportToR4(!useBackportToR4);
  };
  useEffect(() => {
    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('useBackportToR4', (useBackportToR4).toString());
    }
  }, [useBackportToR4]);

  function toggleSkipCapabilitiesCheck() {
    setSkipCapabilitesCheck(!skipCapabilitiesCheck);
  };
  useEffect(() => {
    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('skipCapabilitiesCheck', (skipCapabilitiesCheck).toString());
    }
  }, [skipCapabilitiesCheck])


  /** Disconnect from all connected servers */
  function disconnect() {
    if (_clientHostWebSocketRef.current) {
      _clientHostWebSocketRef.current.onmessage = null;
      _clientHostWebSocketRef.current.close();
      _clientHostWebSocketRef.current = null;
    }

    if (clientHostInfo.registration) {
      // construct the registration REST url

      let url: string = new URL(
        `api/Clients/${clientHostInfo.registration}/`,
        clientHostInfo.url
        ).toString();

      // unregister this client

      ApiHelper.apiDelete(url);
    }
    setClientHostInfo({...clientHostInfo, registration: '', status: ''});
    setFhirServerInfoR4({...fhirServerInfoR4, status: ''});
    setFhirServerInfoR5({...fhirServerInfoR5, status: ''});
  }

  /** Connect to a client host and fhir server and update local information */
  async function connect(
      fhirServer: ConnectionInformation, 
      clientHost: ConnectionInformation,
      completionHandler: ((success: boolean) => void)
      ) {
    // close any existing Client Host websocket connections 
    if (clientHostInfo.status !== '') {
      disconnect();
    }

    /** Test to see if a resource capability includes support for creation */
    function resourceSupportsCreate(resource: fhir.CapabilityStatementRestResource) {
      if (!resource.interaction) {
        return false;
      }
      let found = false;
      resource.interaction!.forEach((interaction: fhir.CapabilityStatementRestResourceInteraction) => {
        if (interaction.code === fhir.CapabilityStatementRestResourceInteractionCodeCodes.CREATE) {
          found = true;
        }
      });
      return found;
    }

    async function connectServer(serverInfo: ConnectionInformation) {
      try {
        // check for capability check bypass

        if (skipCapabilitiesCheck) {
          // still here means success
          return {...serverInfo, 
            status: 'ok',
            supportsCreatePatient: true,
            supportsCreateEncounter: true,
            supportsCreateGroup: true,
            capabilitiesRest: [],
            websocketUrl: '/websockets',
          };
        }
        
        // build a URL to the server capabilities statement
        let capabilityUrl: string = new URL('metadata', serverInfo.url).toString();

        // attempt to get the server capabilities
        let response: ApiResponse<fhir.CapabilityStatement> = await ApiHelper.apiGet<fhir.CapabilityStatement>(
          capabilityUrl,
          serverInfo.authHeaderContent
          );

        if (!response.value) {
          throw(new Error('Could not get valid CapabilityStatement.'));
        }

        let capabilities: fhir.CapabilityStatement = response.value!;

        // check for data we need
        if ((capabilities.rest === null) ||
            (capabilities.rest!.length === 0)) {
          throw(new Error('Could not get valid CapabilityStatement.'));
        }

        let websocketUrl:string = `ws://${serverInfo.url}/websockets`;

        let hasResourcePatient: boolean = false;
        var createPatient: boolean = false;

        let hasResourceEncounter: boolean = false;
        var createEncounter: boolean = false;

        // let hasResourceGroup: boolean = false;
        var createGroup: boolean = false;

        let restCapabilities: fhir.CapabilityStatementRestResource[] = [];

        capabilities.rest!.forEach((restCapability: fhir.CapabilityStatementRest) => {
          if ((restCapability === null) ||
              (restCapability.resource === null) ||
              (restCapability.resource!.length === 0)) {
            return;
          }

          if (restCapability.extension) {
            restCapability.extension.forEach((ext: fhir.Extension) => {
              if ((ext.url === 'http://hl7.org/fhir/StructureDefinition/capabilitystatement-websocket') &&
                  (ext.valueUri)) {
                if ((ext.valueUri.startsWith('ws:')) ||
                    (ext.valueUri.startsWith('wss:'))) {
                  websocketUrl = ext.valueUri;
                } else if (ext.valueUri.startsWith('/')) {
                  websocketUrl = `${serverInfo.url}${ext.valueUri.substr(1)}`;
                  websocketUrl = websocketUrl.replace('http', 'ws');
                } else {
                  websocketUrl = `${serverInfo.url}${ext.valueUri}`;
                  websocketUrl = websocketUrl.replace('http', 'ws');
                }
              }
            });
          }

          // map resources in this rest endpoint
          restCapability.resource!.forEach((resource: fhir.CapabilityStatementRestResource) => {
            if (resource === null) return;

            // add to our list
            restCapabilities.push(resource);

            // handle special ones we need flagged
            switch (resource.type) {
              case 'Patient':
                  hasResourcePatient = true;
                  createPatient = resourceSupportsCreate(resource);
                break;
              case 'Encounter':
                  hasResourceEncounter = true;
                  createEncounter = resourceSupportsCreate(resource);
                break;
              case 'Group':
                  // hasResourceGroup = true;
                  createGroup = resourceSupportsCreate(resource);
                break;
              default: break;
            }
          });
        });
        
        // check for minimum capabilities
        if ((!hasResourcePatient) || (!hasResourceEncounter)) {
          throw(new Error('Minimum server requirements not met.'));
        }

        // still here means success
        return {...serverInfo, 
          status: 'ok',
          supportsCreatePatient: createPatient,
          supportsCreateEncounter: createEncounter,
          supportsCreateGroup: createGroup,
          capabilitiesRest: restCapabilities,
          websocketUrl: websocketUrl,
        };
      } catch (err) {
        return {...serverInfo, status: 'error'};
      }
    }

    async function connectClientHost(clientInfo: ConnectionInformation) {
      try {
        // construct the registration REST url
        let registrationUrl: string = new URL('api/Clients/', clientInfo.url).toString();

        // attempt to register ourself as a client
        var clientHostRegistration: ClientHostRegistration = {uid: '', fhirServerUrl: fhirServer.url};

        let clientHost: ApiResponse<ClientHostRegistration> = await ApiHelper.apiPost<ClientHostRegistration>(
          registrationUrl, 
          clientHostRegistration,
          );

        // build the websocket URL
        let wsUrl: string = new URL(
          '/websockets?uid='+clientHost.value!.uid,
          clientInfo.url.replace('http', 'ws')).toString();

        // connect to our server
        _clientHostWebSocketRef.current = new WebSocket(wsUrl);

        // setup our receive handler
        _clientHostWebSocketRef.current.onmessage = clientHostMessageHandler;

        // setup an error handler to disconnect
        _clientHostWebSocketRef.current.onerror = handleClientHostWebSocketError;
        _clientHostWebSocketRef.current.onclose = handleClientHostWebSocketClose;

        // update our client host information
        return {...clientInfo, 
          registration: clientHost.value!.uid,
          status: 'ok',
        };

      } catch (err) {
        return {...clientInfo, status: 'error'};
      }
    }

    // attempt to connect to the FHIR server
    let updatedFhirServer: ConnectionInformation = await connectServer(fhirServer);

    // check status
    if (updatedFhirServer.status !== 'ok') {
      showToastMessage('Failed to connect to FHIR server', IconNames.ERROR, 2000);
      if (completionHandler) {
        completionHandler(false);
      }
      return;
    }

    // attempt to connect to the Client Host server
    let updatedClientInfo: ConnectionInformation = await connectClientHost(clientHost);

    // check status
    if (updatedClientInfo.status !== 'ok') {
      showToastMessage('Failed to connect to Client Host', IconNames.ERROR, 2000);
      if (completionHandler) {
        completionHandler(false);
      }
      return;
    }

    // update info
    if (useBackportToR4) {
      setFhirServerInfoR4(updatedFhirServer);
    } else {
      setFhirServerInfoR5(updatedFhirServer);
    }

    setClientHostInfo(updatedClientInfo);

    // tell the user we are connected
    showToastMessage('Connected!', IconNames.INFO_SIGN, 2000);

    // flag we are done successfully
    if (completionHandler) {
      completionHandler(true);
    }
  }

  function handleClientHostWebSocketError(event: Event) {
    // close our websocket
    var updatedInfo: ConnectionInformation = {...clientHostInfo,
      status: ''
    };
    setClientHostInfo(updatedInfo);
    showToastMessage('Communication Error with Client Host', IconNames.ERROR, 5000);
  }

  /** Handler to process web socket close events */
  function handleClientHostWebSocketClose(event: Event) {
    // close our websocket
    var updatedInfo: ConnectionInformation = {...clientHostInfo,
      status: ''
    };
    setClientHostInfo(updatedInfo);
    showToastMessage('Disconnected from Client Host', IconNames.INFO_SIGN, 3000);
  }

  /** Callback function to allow panes to register to receive client host notifications (max: 1) */
  function registerPaneClientHostMessageHandler(handler: ((message: string) => void)) {
    _paneHostMessageHandlerRef.current = handler;
  }

  /** Function to process client host messages received via the WebSocket */
  function clientHostMessageHandler(event: MessageEvent) {
    // console.log('Received message event', event);
    // check for keepalive message (discard)
    if ((event.data) && ((event.data as string).startsWith('keepalive'))) {
      // console.log('Recevied keepalive on ClientHost WebSocket', event.data);
      return;
    }

    // display to user (if desired)
    if (clientHostInfo.showMessages) {
      showToastMessage(event.data, IconNames.CLOUD_DOWNLOAD, 2000);
    }

    // log to the console (if desired)
    if (clientHostInfo.logMessages) {
      console.log('ClientHost:', event.data);
    }

    // propagate (if necessary)
    if (_paneHostMessageHandlerRef.current) {
      _paneHostMessageHandlerRef.current!(event.data);
    }
  }

  /** Function to display a short-lived message on the main UI */
  function showToastMessage(message: string, iconName?: IconName, timeout?: number) {
    if (!_toasterRef.current) {
      return;
    }
    _toasterRef.current!.show({message: message, icon: iconName, timeout: timeout});
  }

  /** Function to perform copying generic text to the clipboard */
  function copyToClipboard(message: string, toast?: string) {
    // attempt the copy
    const success = CopyHelper.copyToClipboard(message);

    // notify the user
    if ((success) && (toast)) {
      showToastMessage(`${toast} Copied!`, IconNames.CLIPBOARD, 500);
    }

    if ((!success) && (toast)) {
      showToastMessage('Failed to copy!', IconNames.WARNING_SIGN, 1000);
    }
  }

  function setToasterRef(ref: Toaster) {
    _toasterRef.current = ref;
  }

  /** Render function */
  return (
    <div>
      {/* Render the navigation bar */}
      <MainNavigation
        key='mainNav'
        selectedTabId={selectedNavbarTabId}
        tabs={_tabs}
        onSelectedTabChanged={setSelectedNavbarTabId}
        useBackportToR4={useBackportToR4}
        fhirServerInfoR4={fhirServerInfoR4}
        fhirServerInfoR5={fhirServerInfoR5}
        clientHostInfo={clientHostInfo}
        />
      {/* <div id='mainContent'> */}
        {/* Render the correct content pane, as selected in our tabs above */}
        { _tabs[Number(selectedNavbarTabId)].panel({
          fhirServerInfoR4: fhirServerInfoR4,
          updateFhiServerInfoR4: setFhirServerInfoR4,
          fhirServerInfoR5: fhirServerInfoR5,
          updateFhiServerInfoR5: setFhirServerInfoR5,
          clientHostInfo: clientHostInfo,
          updateClientHostInfo: setClientHostInfo,
          connect: connect,
          disconnect: disconnect,
          registerHostMessageHandler: registerPaneClientHostMessageHandler, //setPaneHostMessageHandler,
          toaster: showToastMessage,
          uiDark: uiDark,
          toggleUiColors: toggleUiColors,
          codePaneDark: codePaneDark,
          toggleCodePaneColors:toggleCodePaneColors,
          copyToClipboard: copyToClipboard,
          useBackportToR4: useBackportToR4,
          toggleUseBackportToR4: toggleUseBackportToR4,
          skipCapabilitiesCheck: skipCapabilitiesCheck,
          toggleSkipCapabilitesCheck: toggleSkipCapabilitiesCheck,
        }) }
      {/* </div> */}
      <Toaster 
        key='toaster'
        position={Position.TOP}
        autoFocus={false}
        canEscapeKeyClear={true}
        ref={setToasterRef}
        usePortal={false}
        />
    </div>
  );
}