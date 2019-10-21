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
  HTMLSelect,
} from '@blueprintjs/core';

import { ContentPaneProps } from '../models/ContentPaneProps';
import { ConnectionInformation } from '../models/ConnectionInformation';
import { StorageHelper } from '../util/StorageHelper';
import { IconNames } from '@blueprintjs/icons';

export default function ConfigurationPane(props: ContentPaneProps) {

  const initialLoadRef = useRef<boolean>(true);

  const [fhirServerUrl, setFhirServerUrl] = useState<string>(props.fhirServerInfo.url);
  const [fhirServerAuth, setFhirServerAuth] = useState<string>(props.fhirServerInfo.authHeaderContent!);
  const [fhirServerPrefer, setFhirServerPrefer] = useState<string>(props.fhirServerInfo.preferHeaderContent);
  // const [fhirServerProxyUrl, setFhirServerProxyUrl] = useState<string>(props.fhirServerInfo.proxyDestinationUrl!)

  const [clientHostUrl, setClientHostUrl] = useState<string>(props.clientHostInfo.url);
  
  const [requestConnectionToggle, setRequestConnectionToggle] = useState<boolean>(false);

  const [busy, setBusy] = useState<boolean>(false);

  const connected = (props.clientHostInfo.status === 'ok');

  const _uiLinks = [
    {
      short: 'forms.office.com',
      description: 'We want your feedback!',
      link:'https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR3_dnSdVFHxEtcOYzItm0qRURVVQT0lKUjMzMzNSVlcwUVZLWFI2NFoxNC4u'
    },
    {
      short: 'build.fhir.org', 
      description: 'Current FHIR R5 Build branch (Subscription, Topic, etc.)', 
      link:'http://build.fhir.org/'
    },
    {
      short: 'github.com',
      description: 'Argonaut Subscription Reference Client UI (this software)',
      link:'https://github.com/microsoft-healthcare-madison/argonaut-subscription-client-ui'
    },
    {
      short: 'github.com',
      description: 'Argonaut Subscription Reference Client Host (manage REST endpoints)',
      link:'https://github.com/microsoft-healthcare-madison/argonaut-subscription-client'
    },
    {
      short: 'github.com',
      description: 'Argonaut Subscription Reference Server Proxy (intercept and process Subscription/Topic)',
      link:'https://github.com/microsoft-healthcare-madison/argonaut-subscription-server-proxy'
    },
    {
      short: 'github.com',
      description: 'September 2019 Connectathon - Argonaut Subscription Scenarios',
      link:'http://aka.ms/argo-sub-connectathon-2019-09'
    },
    {
      short: 'confluence.hl7.org',
      description: 'September 2019 Connectathon - Subscription Track',
      link:'https://confluence.hl7.org/display/FHIR/2019-09+Subscription'
    },
    // {
    //   short: '',
    //   description: '',
    //   link:''
    // },
  ]

  useEffect(() => {
    if (initialLoadRef.current) {

      // **** update local settings that we need values for ****

      if (localStorage.getItem('fhirServerUrl')) {
        setFhirServerUrl(localStorage.getItem('fhirServerUrl')!);
      }

      if (localStorage.getItem('fhirServerAuth')) {
        setFhirServerAuth(localStorage.getItem('fhirServerAuth')!);
      }

      if (localStorage.getItem('fhirServerPrefer')) {
        setFhirServerPrefer(localStorage.getItem('fhirServerPrefer')!);
      }

      // if (localStorage.getItem('fhirServerProxyUrl')) {
      //   setFhirServerProxyUrl(localStorage.getItem('fhirServerProxyUrl')!);
      // }

      if (localStorage.getItem('clientHostUrl')) {
        setClientHostUrl(localStorage.getItem('clientHostUrl')!);
      }

      // **** check for requesting a connection ****

      if ((StorageHelper.isLocalStorageAvailable) &&
          (!connected) &&
          (localStorage.getItem('connectionRequested') === 'true')) {
        setRequestConnectionToggle(true);
      }

      // **** no longer initial load ****

      initialLoadRef.current = false;
    }
  }, [connected]);

  useEffect(() => {

    if (!requestConnectionToggle) {
      return;
    }

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

    // **** check most basic of input ****

    if ((!fhirServerUrl) || 
        (fhirServerUrl.length < 8) || 
        (!fhirServerUrl.startsWith('http'))) {
      // **** error ****

      props.toaster('Invalid FHIR Server URL!', IconNames.ERROR);
      setBusy(false);
      return;
    }

    if ((!clientHostUrl) || 
        (clientHostUrl.length < 8) || 
        (!clientHostUrl.startsWith('http'))) {
      // **** error ****

      props.toaster('Invalid Client Host URL!', IconNames.ERROR);
      setBusy(false);
      return;
    }

    // **** use updated URLs for server and client ****

    let serverInfo: ConnectionInformation = {...props.fhirServerInfo, 
      url: fhirServerUrl,
      authHeaderContent: fhirServerAuth,
      preferHeaderContent: fhirServerPrefer,
    };
    let clientInfo: ConnectionInformation = {...props.clientHostInfo, url: clientHostUrl};

    // **** make sure the URLs end with a trailing slash ****

    if (!fhirServerUrl.endsWith('/')) {
      serverInfo.url = fhirServerUrl + '/';
    }

    if (!clientHostUrl.endsWith('/')) {
      clientInfo.url = clientHostUrl + '/';
    }

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

  function handleFhirServerAuthChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFhirServerAuth(event.target.value);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('fhirServerAuth', event.target.value);
    }
  }

  function handleFhirServerPreferChange(event: React.FormEvent<HTMLSelectElement>) {
    setFhirServerPrefer(event.currentTarget.value);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('fhirServerPrefer', event.currentTarget.value);
    }
  }

  function handleFhirServerProxyUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFhirServerPrefer(event.target.value);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('fhirServerProxyUrl', event.target.value);
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
      {/* <FormGroup
        label = 'FHIR Server Proxy Destination URL'
        helperText = 'ONLY use if using the provided Server-Proxy; sets the destination we are proxying to'
        labelFor='fhir-server-proxy'
        >
        <InputGroup 
          id='fhir-server-proxy'
          value={fhirServerProxyUrl}
          onChange={handleFhirServerProxyUrlChange}
          disabled={connected}
          />
      </FormGroup> */}
      <FormGroup
        label = 'FHIR Server Authorization Header'
        helperText = 'CONTENT of the authorization header the server requires, if any'
        labelFor='fhir-server-auth'
        >
        <InputGroup 
          id='fhir-server-auth'
          value={fhirServerAuth}
          onChange={handleFhirServerAuthChange}
          disabled={connected}
          />
      </FormGroup>
      <FormGroup
        label = 'FHIR Server Prefer Header'
        helperText = 'Type of content preferred by the client for returns'
        labelFor='fhir-server-prefer'
        >
        <HTMLSelect
          onChange={handleFhirServerPreferChange}
          value={fhirServerPrefer}
          disabled={connected}
          >
          <option>minimal</option>
          <option>representation</option>
          <option>OperationOutcome</option>
        </HTMLSelect>
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
            {_uiLinks.map((linkInfo) => (
              <tr>
                <td>{linkInfo.description}</td>
                <td><a
                  href={linkInfo.link} 
                  target='_blank'
                  rel="noopener noreferrer"
                  >{linkInfo.short}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      </Text>
    </Card>
  </div>
  );
}
