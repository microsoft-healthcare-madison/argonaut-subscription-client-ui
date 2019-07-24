import * as React from 'react';

import { 
  Flex, 
  Box 
} from 'reflexbox';

import { 
  Button, 
  Collapse,
  Icon,
  IconName,
  InputGroup,
  Intent,
  Tab,
  TabId,
  Tabs,
  Navbar,
  Classes,
  NavbarHeading,
  NavbarGroup,
  NavbarDivider,
  Alignment,
  AnchorButton,
  Text,
  Toaster,
  Position,
  IToasterProps,
  IToastProps,
  IToaster,
} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';

import {ConfigurationPane} from './ConfigurationPane';
import {Scenario1Pane} from './Scenario1Pane';
import {Scenario2Pane} from './Scenario2Pane';
import { UiTabInformation } from '../models/UiTabInformation';
import { MainNavigation } from './MainNavigation';
import { ConnectionInformation } from '../models/ConnectionInformation';
import { ContentPaneProps } from '../models/ContentPaneProps';
import { TriggerPane } from './TriggerPane';

// **** tab configuration - MUST be in 'id' order - first tab is shown at launch ****

let _tabs: UiTabInformation[] = [
  {title: 'Configuration', id: '0', panel: React.createFactory(ConfigurationPane)},
  {title: 'Scenario 1', id: '1', panel: React.createFactory(Scenario1Pane)},
  {title: 'Scenario 2', id: '2', panel: React.createFactory(Scenario2Pane)},
  {title: 'Triggers', id: '3', panel: React.createFactory(TriggerPane)},
]

interface ComponentState {
  selectedNavbarTabId: string;
  fhirServerInfo: ConnectionInformation;
  clientHostInfo: ConnectionInformation;
  toaster?: IToaster;
}

export interface MainPageProps {}

export class MainPage extends React.PureComponent<MainPageProps> {
  public state: ComponentState = {
      selectedNavbarTabId: _tabs[0].id,
      fhirServerInfo: {
          name: 'FHIR Server', 
          hint: 'URL for an R4 FHIR Server with Subscription and Topic support',
          url: 'http://localhost:56340/', 
          status: '', 
          showMessages: false,
          incomingMessageHandler: ((name: string, message: string) => {}),
        },
      clientHostInfo: {
        name: 'Client Host', 
        hint: 'URL for a running argonaut-client-host service',
        url: 'http://localhost:56345/', 
        status: '', 
        showMessages: true,
        incomingMessageHandler: ((name: string, message: string) => {}),
      },
  };

  constructor(props: MainPageProps) {
    super(props);

    this.state.clientHostInfo.incomingMessageHandler = this.clientHostMessageHandler;
    // this.updateFhirServerInfo = this.updateFhirServerInfo.bind(this);
    // this.updateClientHostInfo = this.updateClientHostInfo.bind(this);
    // this.onSelectedTabChanged = this.onSelectedTabChanged.bind(this);
  }

  public render() {
    return (
      <div>
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
        }) }

        {/* <Button onClick={() => this.state.clientHostInfo.incomingMessageHandler('Me', 'Test')}>Test</Button> */}

      </div>
    );
  }

  private clientHostMessageHandler = (name: string, message: string) => {
    this.showToastMessage(message, IconNames.CLOUD_DOWNLOAD);
  }
  
  private showToastMessage = (message: string, iconName?: IconName, timeout?: number) => {

    let toaster: IToaster = this.getOrCreateToaster();

    toaster.show({message: message, icon: iconName, timeout: timeout});
  }

  private getOrCreateToaster = () => {
    if (!this.state.toaster) {
      var toasterProps: IToasterProps = {
        autoFocus: false,
        canEscapeKeyClear: true,
        position: Position.TOP,
      }
      let toaster = Toaster.create(toasterProps, document.body);
  
      this.setState({toaster: toaster});

      return toaster;
    }

    return this.state.toaster;
  } 

  private updateFhirServerInfo = (updatedInfo: ConnectionInformation) => {
    this.setState({fhirServerInfo: updatedInfo});
  }

  private updateClientHostInfo = (updatedInfo: ConnectionInformation) => {
    this.setState({clientHostInfo: updatedInfo});
  }

  private onSelectedTabChanged = (id: string) => {
    this.setState({selectedNavbarTabId: id});
  }
}
