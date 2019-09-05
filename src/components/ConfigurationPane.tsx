import React, { useState, useEffect, useRef } from 'react';

import { 
  Card,
  Button, 
  InputGroup,
  Intent,
  FormGroup,
  Elevation,
  Switch,
  H5,
  Text,
  HTMLTable,
  Callout,
} from '@blueprintjs/core';

import { ContentPaneProps } from '../models/ContentPaneProps';
import { ConnectionInformation } from '../models/ConnectionInformation';
import { StorageHelper } from '../util/StorageHelper';
import { IconNames } from '@blueprintjs/icons';

export default function ConfigurationPane(props: ContentPaneProps) {

  const initialLoadRef = useRef<boolean>(true);

  const [fhirServerUrl, setFhirServerUrl] = useState<string>(props.fhirServerInfo.url);
  const [clientHostUrl, setClientHostUrl] = useState<string>(props.clientHostInfo.url);
  
  const [requestConnectionToggle, setRequestConnectionToggle] = useState<boolean>(false);

  const [busy, setBusy] = useState<boolean>(false);

  useEffect(() => {
    if (initialLoadRef.current) {

      // **** check for requesting a connection ****

      if ((StorageHelper.isLocalStorageAvailable) &&
          (localStorage.getItem('connectionRequested') === 'true')) {
        setRequestConnectionToggle(true);
      }

      // **** no longer initial load ****

      initialLoadRef.current = false;
    }
  }, []);

  const connected = (props.clientHostInfo.status === 'ok');

  useEffect(() => {

    if (!requestConnectionToggle) {
      return;
    }
    console.log('ConfigurationPane.useEffect <<< here');
    // **** clear our flag ****

    setRequestConnectionToggle(false);

    // **** set busy ****

    setBusy(true);

    function completionHandler(success: boolean) {
      // **** done ****

      setBusy(false);
    }

    // **** if we are connected to a client, we need to disconnect ****

    if (connected) {
      props.disconnect();

      // **** flag we want to be disconnected ****

      if (StorageHelper.isLocalStorageAvailable) {
        localStorage.setItem('connectionRequested', false.toString());
      }

      // **** done ****

      setBusy(false);

      // **** done ****

      return;
    }

    let serverInfo: ConnectionInformation = {...props.fhirServerInfo, url: fhirServerUrl};
    let clientInfo: ConnectionInformation = {...props.clientHostInfo, url: clientHostUrl};

    // **** connect to the servers ****

    props.connect(serverInfo, clientInfo, completionHandler);

    // **** flag we want to be connected ****

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('connectionRequested', true.toString());
    }
    
  }, [requestConnectionToggle]);

  
  /** Event handler for toggling the Show Client Host Messages switch */
  function handleToggleShowClientHostMessages() {
    var updatedInfo: ConnectionInformation = {...props.clientHostInfo, 
      showMessages: !props.clientHostInfo.showMessages
    };
    props.updateClientHostInfo(updatedInfo);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('showMessages', updatedInfo.showMessages.toString());
    }
  }

  /** Event handler for toggling the Log Client Host Messages switch */
  function handleToggleLogClientHostMessages() {
    var updatedInfo: ConnectionInformation = {...props.clientHostInfo, 
      logMessages: !props.clientHostInfo.logMessages
    };
    props.updateClientHostInfo(updatedInfo);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('logMessages', updatedInfo.logMessages.toString());
    }
  }

	/** Process HTML events for the FHIR Server URL text box (update state for managed) */
  function handleFhirServerUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFhirServerUrl(event.target.value);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('fhirServerUrl', event.target.value);
    }
  }

	/** Process HTML events for the Client Host URL text box (update state for managed) */
  function handleClientHostUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    setClientHostUrl(event.target.value);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('clientHostUrl', event.target.value);
    }
  }

  return (
  <div id='mainContent'>
    <Card elevation={Elevation.TWO} key='config_card'>
      <FormGroup
        label = {props.fhirServerInfo.name + ' URL'}
        helperText = {props.fhirServerInfo.hint}
        labelFor='fhir-server-url'
        >
        <InputGroup 
          id='fhir-server-url'
          value={fhirServerUrl}
          onChange={handleFhirServerUrlChange}
          disabled={connected}
          />
      </FormGroup>
      <FormGroup
        label = {props.clientHostInfo.name + ' URL'}
        helperText = {props.clientHostInfo.hint}
        labelFor='fhir-client-url'
        >
        <InputGroup 
          id='fhir-client-url'
          value={clientHostUrl}
          onChange={handleClientHostUrlChange}
          disabled={connected}
          />
      </FormGroup>
      <Button
        disabled={busy}
        onClick={() => setRequestConnectionToggle(true)}
        intent={connected ? Intent.WARNING : Intent.PRIMARY}
        key='connectbutton'
        >
        {connected ? 'Disconnect' : 'Connect'}
      </Button>
      <Switch
        checked={props.clientHostInfo.showMessages}
        label='Display Client Host Messages'
        onChange={handleToggleShowClientHostMessages}
        />
      <Switch
        checked={props.clientHostInfo.logMessages}
        label='Console Log Client Host Messages'
        onChange={handleToggleLogClientHostMessages}
        />
      <Switch
        checked={props.uiDark}
        label='Use Dark Theme for UI'
        onChange={() => props.toggleUiColors(true)}
        />
      <Switch
        checked={props.codePaneDark}
        label='Use Dark Theme for Code Pane'
        onChange={() => props.toggleCodePaneColors(true)}
        />
    </Card>
    <Card elevation={Elevation.TWO} key='info_card'>
      <Text>
        <H5>Argonaut Subscriptions Reference Implementation</H5>
        This module is a front-end user interface to test the current 
        iteration of changes to the FHIR Subscription resource.
        <br/>
        <br/>
        <Callout icon={IconNames.WARNING_SIGN} intent={Intent.WARNING}>
        This is an open FHIR endpoint for testing and educational purposes only.
        <br/>
        Uploading real patient data is strictly prohibited.
        </Callout>
        <br/>
        <br/>
        Note that this software is under heavy development and will be
        updated without notice.
        <br/>
        <br/>
        Useful links:
        <HTMLTable striped={true} interactive={true}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>FHIR Build branch of current changes (Subscription, Topic, etc.)</td>
              <td><a
                href='http://build.fhir.org/branches/argonaut-subscription/' 
                target='_blank'
                rel="noopener noreferrer"
                >build.fhir.org</a>
              </td>
            </tr>
            <tr>
              <td>Argonaut Subscription Connectathon Scenarios</td>
              <td><a
                href='https://github.com/argonautproject/subscriptions/tree/master/connectathon-scenarios-201909' 
                target='_blank'
                rel="noopener noreferrer"
                >github.com</a>
              </td>
            </tr>
            <tr>
              <td>September 2019 Subscription Connectathon Track</td>
              <td><a
                href='https://confluence.hl7.org/display/FHIR/2019-09+Subscription' 
                target='_blank'
                rel="noopener noreferrer"
                >confluence.hl7.org</a>
              </td>
            </tr>
            <tr>
              <td>Argonaut Subscription Reference Client UI (this software)</td>
              <td><a
                href='https://github.com/microsoft-healthcare-madison/argonaut-subscription-client-ui' 
                target='_blank'
                rel="noopener noreferrer"
                >github.com</a>
              </td>
            </tr>
            <tr>
              <td>Argonaut Subscription Reference Client Host (manage REST endpoints)</td>
              <td><a
                href='https://github.com/microsoft-healthcare-madison/argonaut-subscription-client' 
                target='_blank'
                rel="noopener noreferrer"
                >github.com</a>
              </td>
            </tr>
            <tr>
              <td>Argonaut Subscription Reference Server Proxy (intercept and process Subscription/Topic)</td>
              <td><a
                href='https://github.com/microsoft-healthcare-madison/argonaut-subscription-server-proxy' 
                target='_blank'
                rel="noopener noreferrer"
                >github.com</a>
              </td>
            </tr>
          </tbody>
        </HTMLTable>
      </Text>
    </Card>
  </div>
  );
}
