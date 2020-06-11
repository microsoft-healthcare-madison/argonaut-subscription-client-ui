import React, {useRef, useState, useEffect} from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { Button, FormGroup, InputGroup, HTMLSelect } from '@blueprintjs/core';
import { Subscription, SubscriptionContentCodes } from '../../models/fhir_r5';
import { IconNames } from '@blueprintjs/icons';

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

  const [websocketUrl, setWebsocketUrl] = useState<string>('/subscriptions/websocketurl');
  const [boundSubscriptionIds, setBoundSubscriptionIds] = useState<string[]>([]);
  const [payloadType, setPayloadType] = useState<string>('r4');
  const [connected, setConnected] = useState<boolean>(false);

  const [subscriptionIndex, setSubscriptionIndex] = useState<number>(-1);
  const [subscriptionId, setSubscriptionId] = useState<string>('');


  useEffect(() => {
    if (subscriptionIndex >= props.subscriptions.length) {
      setSubscriptionIndex(-1);
      setSubscriptionId('')
    }
    if ((subscriptionIndex < 0) && (props.subscriptions.length > 0)) {
      setSubscriptionIndex(0);
      setSubscriptionId(props.subscriptions[0].id!);
    }
  }, [subscriptionIndex, props.subscriptions]);

  async function connect() {
    try {
      // construct the websocket url
      let wsUrl: string = new URL(
        `${websocketUrl}?payload-type=${payloadType}`,
        props.paneProps.fhirServerInfo.url.replace('http', 'ws')
        ).toString();

      // connect to our server
      _webSocketRef.current = new WebSocket(wsUrl);

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
    setBoundSubscriptionIds([]);

    // warn the user
    props.paneProps.toaster('Websocket disconnected from FHIR Server', IconNames.INFO_SIGN, 2000);

    props.updateStatus({...props.status, busy: false});

  }

  function isSubscriptionBound(subscriptionId: string): boolean {
    for (let index:number = 0; index < boundSubscriptionIds.length; index++) {
      if (boundSubscriptionIds[index] === subscriptionId) {
        return true;
      }
    }
    return false;
  }

  function toggleConnection() {
    props.updateStatus({...props.status, busy: true});
    if (connected) {
      disconnect();
      return;
    }

    connect();
  }

  function toggleBinding() {
    if (isSubscriptionBound(subscriptionId)) {
      // unbind
      _webSocketRef.current!.send(`unbind ${subscriptionId}`)

      // remove from list
      for (let index:number = 0; index < boundSubscriptionIds.length; index++) {
        if (boundSubscriptionIds[index] === subscriptionId) {
          let updated:string[] = boundSubscriptionIds.slice();
          updated.splice(index);
          setBoundSubscriptionIds(updated);
        }
      }

      return;
    }

    // bind
    _webSocketRef.current!.send(`bind ${subscriptionId}`);

    // add to list
    let updated:string[]  = boundSubscriptionIds.slice();
    updated.push(subscriptionId);
    setBoundSubscriptionIds(updated);
  }

  
  /** Function to process client host messages received via the WebSocket */
  function websocketMessageHandler(event: MessageEvent) {
    console.log('Received FHIR Notification', event);
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
  
  /** Process HTML events for the endpoint select box */
  function handleSubscriptionChange(event: React.FormEvent<HTMLSelectElement>) {
    setSubscriptionIndex(parseInt(event.currentTarget.value));
  }

  /** Process HTML events for the payload type select box */
	function handlePayloadTypeChange(event: React.FormEvent<HTMLSelectElement>) {
		setPayloadType(event.currentTarget.value);
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

      <FormGroup
        label='Websocket Payload Type'
        helperText='Payload type for Websocket notifications'
        labelFor='websocket-payload-type'
        >
        <HTMLSelect
            id='websocket-payload-type'
            onChange={handlePayloadTypeChange}
            value={payloadType}
              >
            <option key={'r4'}>R4</option>
            { Object.values(SubscriptionContentCodes).map((value) => (
            <option key={value}>{value}</option> 
              ))}
          </HTMLSelect>
      </FormGroup>

      <Button
        onClick={toggleConnection}
        >
        {connected ? 'Disconnect' : 'Connect'} Websocket
      </Button>
      { connected && 
        <FormGroup
          label='Subscription'
          helperText='Subscription to interact with'
          labelFor='subscription'
          >
          <HTMLSelect
            id='subscription'
            onChange={handleSubscriptionChange}
            value={subscriptionIndex}
            >
            { Object.values(props.subscriptions).map((value, index) => (
              <option key={value.id} value={index}>Subscription #{index} - {value.id}</option>
                ))}
          </HTMLSelect>
          <Button
            onClick={toggleBinding}
            disabled={!connected}
            >
            { isSubscriptionBound(subscriptionId) ? 'Unbind' : 'Bind' }
          </Button>
        </FormGroup>
      }
    </DataCard>
  );
}