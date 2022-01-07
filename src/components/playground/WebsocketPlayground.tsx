import React, {useRef, useState, useEffect} from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { Button, FormGroup, InputGroup, Switch } from '@blueprintjs/core';
import { Subscription, Parameters, ParametersParameter } from 'fhir5';
import { IconNames } from '@blueprintjs/icons';
import { ApiHelper, ApiResponse } from '../../util/ApiHelper';

export interface WebsocketPlaygroundProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  subscriptions: Subscription[],
  handleHostMessage: ((message: string) => void),
}

/** Component representing the Playground Endpoint Card */
export default function WebsocketPlayground(props: WebsocketPlaygroundProps) {

  const info: DataCardInfo = {
    id: 'playground_websocket',
    heading: 'FHIR Server - WebSocket Interactions',
    description: '',
    optional: false,
  };

  const _webSocketRef = useRef<WebSocket | null>(null);
  const _bindingMap = useRef<Map<string,string[]>>(new Map());

  const [websocketUrl, setWebsocketUrl] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);

  const [selectedSubscriptionIds, setSelectedSubscriptionIds] = useState<string[]>([]);

  useEffect(() => {
    if (props.paneProps.useBackportToR4) {
      setWebsocketUrl(props.paneProps.fhirServerInfoR4.websocketUrl);
    } else {
      setWebsocketUrl(props.paneProps.fhirServerInfoR5.websocketUrl);
    }
  }, [props.paneProps.useBackportToR4, props.paneProps.fhirServerInfoR4, props.paneProps.fhirServerInfoR5])

  /**
   * Connect to a FHIR server via websockets
   */
  async function connect() {
    try {
      // connect to our server
      _webSocketRef.current = new WebSocket(websocketUrl);

      // setup our receive handler
      _webSocketRef.current.onmessage = websocketMessageHandler;

      // setup an error handler to disconnect
      _webSocketRef.current.onerror = handleWebSocketError;
      _webSocketRef.current.onclose = handleWebSocketClose;

      setConnected(true);
      props.updateStatus({...props.status, busy: false});
    } catch (err) {
      // return {...clientInfo, status: 'error'};
      props.updateStatus({...props.status, busy: false});
    }
  }

  function disconnect() {
    _webSocketRef.current = null;
    setConnected(false);

    // warn the user
    props.paneProps.toaster('Websocket disconnected from FHIR Server', IconNames.INFO_SIGN, 2000);

    props.updateStatus({...props.status, busy: false});
  }

  function toggleConnection() {
    props.updateStatus({...props.status, busy: true});
    if (connected) {
      disconnect();
      return;
    }

    connect();
  }

  async function bindToSubscriptions() {
    if (!connected) {
      return;
    }

    if (selectedSubscriptionIds.length === 0) {
      props.paneProps.toaster('Please select at least one subscription', IconNames.ERROR);
      return;
    }

    let opParams:Parameters = {
      resourceType: 'Parameters',
      parameter: []
    }

    selectedSubscriptionIds.forEach((id:string) => {
      opParams.parameter!.push({
        name: 'ids',
        valueId: id,
      });
    });

    let response:ApiResponse<Parameters>;

    if (props.paneProps.useBackportToR4) {
      let url:string = new URL(
        'Subscription/$get-ws-binding-token',
        props.paneProps.fhirServerInfoR4.url).toString();
  
      response = await ApiHelper.apiPostFhir<Parameters>(
        url,
        opParams,
        props.paneProps.fhirServerInfoR4.authHeaderContent,
        props.paneProps.fhirServerInfoR4.preferHeaderContent);
    } else {
      let url:string = new URL(
        'Subscription/$get-ws-binding-token',
        props.paneProps.fhirServerInfoR5.url).toString();
  
      response = await ApiHelper.apiPostFhir<Parameters>(
        url,
        opParams,
        props.paneProps.fhirServerInfoR5.authHeaderContent,
        props.paneProps.fhirServerInfoR5.preferHeaderContent);
    }

    let token:string|undefined;
    let expiration:string|undefined;

    if ((response.value) && 
        (response.value.parameter)) {
      response.value.parameter.forEach((param:ParametersParameter) => {
        if ((param.name === 'token') && (param.valueString)) {
          token = param.valueString;
        }
        if ((param.name === 'expiration') && (param.valueDateTime)) {
          expiration = param.valueDateTime;
        }
      });
    }

    if ((token) && (expiration)) {
      _webSocketRef.current!.send(`bind-with-token ${token}`);
      _bindingMap.current.set(token, selectedSubscriptionIds);
    }

    props.paneProps.toaster(`Bound to ${selectedSubscriptionIds.length} subscriptions!`, IconNames.THUMBS_UP);
    setSelectedSubscriptionIds([]);
  }
  
  /** Function to process client host messages received via the WebSocket */
  function websocketMessageHandler(event: MessageEvent) {
    // check for keepalive message (discard)
    if ((event.data) && ((event.data as string).startsWith('keepalive'))) {
      // console.log('Recevied keepalive on ClientHost WebSocket', event.data);
      return;
    }

    // display to user (if desired)
    if (props.paneProps.clientHostInfo.showMessages) {
      props.paneProps.toaster(event.data, IconNames.CLOUD);
    }

    // log to the console (if desired)
    if (props.paneProps.clientHostInfo.logMessages) {
      console.log('FHIR Websocket:', event.data);
    }

    props.handleHostMessage(event.data);
  }
  
  function handleWebSocketError(event: Event) {
    _webSocketRef.current = null;

    // warn the user
    props.paneProps.toaster('Websocket Error with FHIR Server', IconNames.ERROR, 2000);
  }

  /** Handler to process web socket close events */
  function handleWebSocketClose(event: Event) {
    disconnect();
  }

  /** Process HTML events for websocket url (update state for managed) */
  function handleWebsocketUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    setWebsocketUrl(event.target.value);
  }
  
  function handleToggleSubscription(id: string) {
    let index = selectedSubscriptionIds.indexOf(id);
    let values: string[] = selectedSubscriptionIds.slice();

    if (index >= 0) {
      values.splice(index, 1);
      setSelectedSubscriptionIds(values);
      return;
    }

    values.push(id);
    setSelectedSubscriptionIds(values);
  }

  /** Return this component */
  return(
    <DataCard
      info={info}
      data={props.data}
      paneProps={props.paneProps}
      status={props.status}
      >
      <FormGroup
        label='Websocket URL'
        helperText='URL Path for connecting to the Websocket host on the FHIR server'
        labelFor='websocket-url'
        >
        <InputGroup
          id='websocket-url'
          value={websocketUrl}
          onChange={handleWebsocketUrlChange}
          disabled={connected}
          />
      </FormGroup>

      <Button
        onClick={toggleConnection}
        >
        {connected ? 'Disconnect' : 'Connect'} Websocket
      </Button>
      { (connected && (props.subscriptions.length > 0)) &&
        <FormGroup
          label='Subscription'
          helperText='Subscriptions to interact with'
          labelFor='subscription'
          >
          { Object.values(props.subscriptions).map((value, index) => (
            <Switch 
              key={value.id} 
              value={value.id}
              checked={selectedSubscriptionIds.includes(value.id!)}
              label={`Subscription #${index}: ${value.id}`}
              onChange={() => handleToggleSubscription(value.id!)}
              />
              ))}
          <Button
            onClick={bindToSubscriptions}
            disabled={!connected}
            >
            Bind to Selected
          </Button>
        </FormGroup>
      }
    </DataCard>
  );
}