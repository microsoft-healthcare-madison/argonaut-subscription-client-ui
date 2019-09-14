import React, {useRef, useState} from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import { ApiHelper, ApiResponse } from '../../util/ApiHelper';
import { Button, FormGroup, InputGroup } from '@blueprintjs/core';
import { Subscription } from '../../models/fhir_r4_selected';
import { IconNames } from '@blueprintjs/icons';

export interface WebsocketPlaygroundProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  endpoints: EndpointRegistration[],
  setEndpoints: ((data: EndpointRegistration[]) => void),
  subscriptions: Subscription[],
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
  const [websocketPayloadType, setWebsocketPayloadType] = useState<string>();
  const [connected, setConnected] = useState<boolean>(false);

  async function connect() {
    try {
      // **** construct the websocket url ****

      let wsUrl: string = new URL(
        websocketUrl,
        props.paneProps.fhirServerInfo.url.replace('http', 'ws')
        ).toString();

      // **** connect to our server ****

      _webSocketRef.current = new WebSocket(wsUrl);

      // **** setup our receive handler ****

      _webSocketRef.current.onmessage = websocketMessageHandler;

      // **** setup an error handler to disconnect ****

      _webSocketRef.current.onerror = handleWebSocketError;
      _webSocketRef.current.onclose = handleWebSocketClose;

      // **** update our client host information ****

      // return {...clientInfo, 
      //   registration: clientHost.value!.uid,
      //   status: 'ok',
      // };

    } catch (err) {
      // return {...clientInfo, status: 'error'};
    }
  }

  function disconnect() {
    _webSocketRef.current = null;

    // **** warn the user ****

    props.paneProps.toaster('Websocket disconnected from FHIR Server', IconNames.INFO_SIGN, 2000);
  }



  function toggleConnection() {
    if (connected) {
    }
  }

  
  /** Function to process client host messages received via the WebSocket */
  function websocketMessageHandler(event: MessageEvent) {
    // console.log('Received message event', event);
    // **** check for keepalive message (discard) ****

    if ((event.data) && ((event.data as string).startsWith('keepalive'))) {
      // console.log('Recevied keepalive on ClientHost WebSocket', event.data);
      return;
    }
    // **** display to user (if desired) ****

    if (props.paneProps.clientHostInfo.showMessages) {
      props.paneProps.toaster(event.data, IconNames.CLOUD);
    }

    // **** log to the console (if desired) ****

    if (props.paneProps.clientHostInfo.logMessages) {
      console.log('FHIR Websocket:', event.data);
    }

  }
  
  function handleWebSocketError(event: Event) {
    _webSocketRef.current = null;

    // **** warn the user ****

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
    </DataCard>
  );
}