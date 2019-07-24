import * as React from 'react';

import { 
  Button, 
  Collapse,
  Icon,
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
} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';
import { UiTabInformation } from '../models/UiTabInformation';
import { ConnectionInformation } from '../models/ConnectionInformation';

export interface MainNavigationProps {
  tabs: UiTabInformation[];
  selectedTabId: string;
  onSelectedTabChanged: ((id: string) => void);
  fhirServerInfo: ConnectionInformation;
  clientHostInfo: ConnectionInformation;
}

export class MainNavigation extends React.PureComponent<MainNavigationProps> {
  // public state = {
  // };

  // constructor(props: MainNavigationProps) {
  //     super(props);
  // };

  public render() {
    return (
      <Navbar className={Classes.DARK}>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>Argonaut Subscription Client</NavbarHeading>
          <NavbarDivider />
        </NavbarGroup>

        <NavbarGroup align={Alignment.RIGHT}>
          <AnchorButton
            href='http://github.com/microsoft-healthcare-madison/argonaut-subscription-client-ui'
            text='Github'
            target='_blank'
            minimal
            rightIcon='code'
            />
        </NavbarGroup>

        <NavbarGroup align={Alignment.LEFT}>
            <Tabs
              animate={true}
              id='navbar'
              large={true}
              onChange={this.handleNavbarTabChange}
              selectedTabId={this.props.selectedTabId}
              >
            
              { // **** add a tab for each known one ****
                this.props.tabs.map(function(tab, index) {
                  return <Tab key={index} id={tab.id} title={tab.title} />
                }) 
              }
              <Tabs.Expander />
            </Tabs>
            <NavbarDivider />
        </NavbarGroup>

        <NavbarGroup align={Alignment.RIGHT}>
          <NavbarHeading>{this.props.fhirServerInfo.name}: {this.iconForStatus(this.props.fhirServerInfo.status)}</NavbarHeading>
          <NavbarHeading>{this.props.clientHostInfo.name}: {this.iconForStatus(this.props.clientHostInfo.status)}</NavbarHeading>
        </NavbarGroup>

      </Navbar>

    );
  }

  private iconForStatus = (status: string) => {
    switch (status) {
      case 'connecting':
        return <Icon icon={IconNames.DOT} intent={Intent.NONE} />;
      case 'testing':
        return <Icon icon={IconNames.DOT} intent={Intent.NONE} />;
      case 'ok':
        return <Icon icon={IconNames.TICK} intent={Intent.PRIMARY} />;
      case 'error':
          return <Icon icon={IconNames.CROSS} intent={Intent.WARNING} />;
      default:
          return '-';
    }
  };


  private handleNavbarTabChange = (navbarTabId: TabId) => {
    this.props.onSelectedTabChanged(navbarTabId.toString());
  }
}
