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

  const [fhirServerUrlR4, setFhirServerUrlR4] = useState<string>(props.fhirServerInfoR4.url);
  const [fhirServerAuthR4, setFhirServerAuthR4] = useState<string>(props.fhirServerInfoR4.authHeaderContent!);
  const [fhirServerPreferR4, setFhirServerPreferR4] = useState<string>(props.fhirServerInfoR4.preferHeaderContent);
  const [fhirServerUrlR5, setFhirServerUrlR5] = useState<string>(props.fhirServerInfoR5.url);
  const [fhirServerAuthR5, setFhirServerAuthR5] = useState<string>(props.fhirServerInfoR5.authHeaderContent!);
  const [fhirServerPreferR5, setFhirServerPreferR5] = useState<string>(props.fhirServerInfoR5.preferHeaderContent);
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
      short: 'microsoft-healthcare-madison.github.io',
      description: 'About this software - Argonaut Subscriptions Reference Implementation',
      link:'https://microsoft-healthcare-madison.github.io/argonaut-subscription-info/'
    },
    {
      short: 'build.fhir.org', 
      description: 'Current FHIR R5 Build branch (Subscription, SubscriptionTopic, etc.)', 
      link:'http://build.fhir.org/branches/subscription-b/'
      // link:'http://build.fhir.org/'
    },
    {
      short: 'argonautproject.github.io', 
      // short: 'build.fhir.org', 
      description: 'CI Build FHIR-I Subscription Backport (R5 to R4) IG', 
      link:'https://argonautproject.github.io/subscription-backport-ig/'
      // link:'http://build.fhir.org/ig/HL7/fhir-subscription-backport-ig/'
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
      description: 'Argonaut Subscription Reference Server Proxy (intercept and process Subscription/SubscriptionTopic)',
      link:'https://github.com/microsoft-healthcare-madison/argonaut-subscription-server-proxy'
    },
    {
      short: 'confluence.hl7.org',
      description: 'September 2021 Connectathon (#28) - Subscriptions',
      link: 'https://confluence.hl7.org/display/FHIR/2021-09+Subscriptions'
    },
    {
      short: 'confluence.hl7.org',
      description: 'May 2021 Connectathon (#27) - Subscriptions',
      link: 'https://confluence.hl7.org/display/FHIR/2021-05+Subscriptions'
    },
    {
      short: 'confluence.hl7.org',
      description: 'January 2021 Connectathon (#26) - Subscriptions',
      link: 'https://confluence.hl7.org/display/FHIR/2021-01+Subscriptions+Track'
    },
    {
      short: 'confluence.hl7.org',
      description: 'September 2020 Connectathon (#25) - Subscriptions',
      link: 'https://confluence.hl7.org/display/FHIR/2020-09+Subscriptions+Track'
    },
    {
      short: 'confluence.hl7.org',
      description: 'May 2020 Connectathon (#24) - Subscriptions',
      link:'https://confluence.hl7.org/display/FHIR/2020-05+Subscriptions+Track'
    },
    {
      short: 'confluence.hl7.org',
      description: 'January 2020 CMS Connectathon (#1) - Subscriptions',
      link:'https://confluence.hl7.org/display/FHIR/2020-01+Subscriptions'
    },
    {
      short: 'confluence.hl7.org',
      description: 'February 2020 Connectathon (#23) - Subscription Track',
      link:'https://confluence.hl7.org/display/FHIR/2020-02+Subscriptions+Track'
    },
    {
      short: 'github.com',
      description: 'September 2019 Connectathon - Argonaut Subscription Scenarios',
      link:'http://aka.ms/argo-sub-connectathon-2019-09'
    },
    {
      short: 'confluence.hl7.org',
      description: 'September 2019 Connectathon (#22) - Subscription Track',
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

      // update local settings that we need values for
      if (localStorage.getItem('fhirServerUrlR4')) {
        setFhirServerUrlR4(localStorage.getItem('fhirServerUrlR4')!);
      }

      if (localStorage.getItem('fhirServerAuthR4')) {
        setFhirServerAuthR4(localStorage.getItem('fhirServerAuthR4')!);
      }

      if (localStorage.getItem('fhirServerPreferR4')) {
        setFhirServerPreferR4(localStorage.getItem('fhirServerPreferR4')!);
      }

      if (localStorage.getItem('fhirServerUrlR5')) {
        setFhirServerUrlR5(localStorage.getItem('fhirServerUrlR5')!);
      }

      if (localStorage.getItem('fhirServerAuthR5')) {
        setFhirServerAuthR5(localStorage.getItem('fhirServerAuthR5')!);
      }

      if (localStorage.getItem('fhirServerPreferR5')) {
        setFhirServerPreferR5(localStorage.getItem('fhirServerPreferR5')!);
      }

      // if (localStorage.getItem('fhirServerProxyUrl')) {
      //   setFhirServerProxyUrl(localStorage.getItem('fhirServerProxyUrl')!);
      // }

      if (localStorage.getItem('clientHostUrl')) {
        setClientHostUrl(localStorage.getItem('clientHostUrl')!);
      }
      
      // check for requesting a connection

      if ((StorageHelper.isLocalStorageAvailable) &&
          (!connected) &&
          (localStorage.getItem('connectionRequested') === 'true')) {
        setRequestConnectionToggle(true);
      }

      // no longer initial load

      initialLoadRef.current = false;
    }
  }, [connected]);

  useEffect(() => {

    if (!requestConnectionToggle) {
      return;
    }

    // clear our flag
    setRequestConnectionToggle(false);

    // set busy
    setBusy(true);

    function completionHandler(success: boolean) {
      setBusy(false);
    }

    // if we are connected to a client, we need to disconnect
    if (connected) {
      props.disconnect();

      // flag we want to be disconnected
      if (StorageHelper.isLocalStorageAvailable) {
        localStorage.setItem('connectionRequested', false.toString());
      }

      setBusy(false);
      return;
    }

    let serverInfoR4: ConnectionInformation = {...props.fhirServerInfoR4,
      url: fhirServerUrlR4,
      authHeaderContent: fhirServerAuthR4,
      preferHeaderContent: fhirServerPreferR4,
    };

    // check most basic of input
    if ((!serverInfoR4.url) || 
        (serverInfoR4.url.length < 8) || 
        (!serverInfoR4.url.startsWith('http'))) {
      // error

      props.toaster('Invalid FHIR Server URL!', IconNames.ERROR);
      setBusy(false);
      return;
    }

    if (!serverInfoR4.url.endsWith('/')) {
      serverInfoR4.url = serverInfoR4.url + '/';
    }

    let serverInfoR5: ConnectionInformation = {...props.fhirServerInfoR5,
      url: fhirServerUrlR5,
      authHeaderContent: fhirServerAuthR5,
      preferHeaderContent: fhirServerPreferR5,
    };

    // check most basic of input
    if ((!serverInfoR5.url) || 
        (serverInfoR5.url.length < 8) || 
        (!serverInfoR5.url.startsWith('http'))) {
      // error

      props.toaster('Invalid FHIR Server URL!', IconNames.ERROR);
      setBusy(false);
      return;
    }

    if (!serverInfoR5.url.endsWith('/')) {
      serverInfoR5.url = serverInfoR5.url + '/';
    }

    let clientInfo: ConnectionInformation = {...props.clientHostInfo, url: clientHostUrl};

    if ((!clientInfo.url) || 
        (clientInfo.url.length < 8) || 
        (!clientInfo.url.startsWith('http'))) {
      // error

      props.toaster('Invalid Client Host URL!', IconNames.ERROR);
      setBusy(false);
      return;
    }

    if (!clientInfo.url.endsWith('/')) {
      clientInfo.url = clientHostUrl + '/';
    }

    // connect to the servers

    if (props.useBackportToR4) {
      props.connect(serverInfoR4, clientInfo, completionHandler);
    } else {
      props.connect(serverInfoR5, clientInfo, completionHandler);
    }

    // flag we want to be connected
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
  function handleFhirServerUrlChangeR4(event: React.ChangeEvent<HTMLInputElement>) {
    setFhirServerUrlR4(event.target.value);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('fhirServerUrlR4', event.target.value);
    }
  }

	/** Process HTML events for the FHIR Server URL text box (update state for managed) */
  function handleFhirServerUrlChangeR5(event: React.ChangeEvent<HTMLInputElement>) {
    setFhirServerUrlR5(event.target.value);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('fhirServerUrlR5', event.target.value);
    }
  }

  function handleFhirServerAuthChangeR4(event: React.ChangeEvent<HTMLInputElement>) {
    setFhirServerAuthR4(event.target.value);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('fhirServerAuthR4', event.target.value);
    }
  }

  function handleFhirServerPreferChangeR4(event: React.FormEvent<HTMLSelectElement>) {
    setFhirServerPreferR4(event.currentTarget.value);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('fhirServerPreferR4', event.currentTarget.value);
    }
  }

  function handleFhirServerAuthChangeR5(event: React.ChangeEvent<HTMLInputElement>) {
    setFhirServerAuthR5(event.target.value);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('fhirServerAuthR5', event.target.value);
    }
  }

  function handleFhirServerPreferChangeR5(event: React.FormEvent<HTMLSelectElement>) {
    setFhirServerPreferR5(event.currentTarget.value);

    if (StorageHelper.isLocalStorageAvailable) {
      localStorage.setItem('fhirServerPreferR5', event.currentTarget.value);
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
        label = {props.fhirServerInfoR4.name + ' URL'}
        helperText = {props.fhirServerInfoR4.hint}
        labelFor='fhir-server-url-r4'
        >
        <InputGroup 
          id='fhir-server-url-r4'
          value={fhirServerUrlR4}
          onChange={handleFhirServerUrlChangeR4}
          disabled={connected}
          />
      </FormGroup>
      <FormGroup
        label = 'FHIR R4 Server Authorization Header'
        helperText = 'CONTENT of the authorization header the R4 server requires, if any'
        labelFor='fhir-server-auth-r4'
        >
        <InputGroup 
          id='fhir-server-auth-r4'
          value={fhirServerAuthR4}
          onChange={handleFhirServerAuthChangeR4}
          disabled={connected}
          />
      </FormGroup>
      <FormGroup
        label = 'FHIR R4 Server Prefer Header'
        helperText = 'Type of content preferred by the client for returns'
        labelFor='fhir-server-prefer-r4'
        >
        <HTMLSelect
          onChange={handleFhirServerPreferChangeR4}
          value={fhirServerPreferR4}
          disabled={connected}
          >
          <option>minimal</option>
          <option>representation</option>
          <option>OperationOutcome</option>
        </HTMLSelect>
      </FormGroup>

      <FormGroup
        label = {props.fhirServerInfoR5.name + ' URL'}
        helperText = {props.fhirServerInfoR5.hint}
        labelFor='fhir-server-url-r5'
        >
        <InputGroup 
          id='fhir-server-url-r5'
          value={fhirServerUrlR5}
          onChange={handleFhirServerUrlChangeR5}
          disabled={connected}
          />
      </FormGroup>
      <FormGroup
        label = 'FHIR R5 Server Authorization Header'
        helperText = 'CONTENT of the authorization header the R5 server requires, if any'
        labelFor='fhir-server-auth-r5'
        >
        <InputGroup 
          id='fhir-server-auth-r5'
          value={fhirServerAuthR5}
          onChange={handleFhirServerAuthChangeR5}
          disabled={connected}
          />
      </FormGroup>
      <FormGroup
        label = 'FHIR R5 Server Prefer Header'
        helperText = 'Type of content preferred by the client for returns'
        labelFor='fhir-server-prefer-r5'
        >
        <HTMLSelect
          onChange={handleFhirServerPreferChangeR5}
          value={fhirServerPreferR5}
          disabled={connected}
          >
          <option>minimal</option>
          <option>representation</option>
          <option>OperationOutcome</option>
        </HTMLSelect>
      </FormGroup>
      <FormGroup
        label = {props.clientHostInfo.name + ' URL (only change if you are hosting the Argonaut Subscription Client Host yourself)'}
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
        checked={props.useBackportToR4}
        label='Use Backport To R4 (FHIR-I Backport IG)'
        disabled={connected}
        onChange={() => props.toggleUseBackportToR4(true)}
        />
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
      <Switch
        checked={props.skipCapabilitiesCheck}
        label='Skip FHIR Server Capabilities Check'
        onChange={() => props.toggleSkipCapabilitesCheck(true)}
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
