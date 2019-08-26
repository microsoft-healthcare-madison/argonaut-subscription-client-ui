import * as React from 'react';

import { 
  Icon,
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
  ResizeSensor,
  IResizeEntry,
  Drawer,
  Position,
  H5,
  // Tooltip,
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

interface ComponentState {
  renderSmall: boolean,
  showNavDrawer: boolean,
}

/** Minimum width to render the full menu */
const _minWidthToRenderFull: number = 900;

export class MainNavigation extends React.PureComponent<MainNavigationProps> {
  public state: ComponentState = {
    renderSmall: false,
    showNavDrawer: false,
  };

  // constructor(props: MainNavigationProps) {
  //     super(props);
  // };

  public render() {
    return (
      <ResizeSensor onResize={this.handleResize}>
        <Navbar className={Classes.DARK}>
          {/* Left side of nav-bar desktop */}
          { !this.state.renderSmall &&
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>Argonaut Subscriptions Client</NavbarHeading>
            <NavbarDivider />
            <Tabs
                animate={true}
                id='navbar'
                large={true}
                onChange={this.handleNavbarTabChange}
                selectedTabId={this.props.selectedTabId}
                vertical={false}
                >
                { // **** add our tabs ****
                  this.props.tabs.map((tab) => (
                    <Tab key={tab.id} id={tab.id}>
                      {/* <Tooltip content={tab.tip}> */}
                        {tab.title}
                      {/* </Tooltip> */}
                    </Tab>
                  ))
                }
                {/* <Tabs.Expander /> */}
              </Tabs>
          </NavbarGroup>
          }

          {/* Left side of nav-bar mobile */}
          { this.state.renderSmall &&
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>Subscriptions</NavbarHeading>
          </NavbarGroup>
          }

          {/* Right side of nav-bar desktop */}
          { !this.state.renderSmall &&
          <NavbarGroup align={Alignment.RIGHT}>
            <NavbarHeading>{this.iconForStatus(this.props.fhirServerInfo.status)} {this.props.fhirServerInfo.name}</NavbarHeading>
            <NavbarHeading>{this.iconForStatus(this.props.clientHostInfo.status)} {this.props.clientHostInfo.name}</NavbarHeading>
            {/* <NavbarDivider />
            <AnchorButton
              href='http://github.com/microsoft-healthcare-madison/argonaut-subscription-client-ui'
              text='Github'
              target='_blank'
              minimal
              rightIcon='code'
              /> */}
          </NavbarGroup>
          }

          {/* Right side of nav-bar mobile */}
          { this.state.renderSmall &&
          <NavbarGroup align={Alignment.RIGHT}>
            <AnchorButton
              icon={IconNames.MENU}
              onClick={this.handleShowNavDrawer}
              />
            <Drawer
              isOpen={this.state.showNavDrawer}
              canEscapeKeyClose={true}
              autoFocus={true}
              hasBackdrop={true}
              position={Position.LEFT}
              usePortal={true}
              onClose={this.handleNavDrawerClose}
              size={Drawer.SIZE_LARGE}
              >
              <Tabs
                animate={true}
                id='navbar'
                large={true}
                onChange={this.handleNavbarTabChange}
                selectedTabId={this.props.selectedTabId}
                vertical={true}
                >
                { // **** add our tabs ****
                  this.props.tabs.map((tab) => (
                    <Tab key={tab.id} id={tab.id} title={tab.title}/>
                  ))
                }
              </Tabs>
              <br />
              <H5 style={{margin: 5}}>{this.iconForStatus(this.props.fhirServerInfo.status)} {this.props.fhirServerInfo.name}</H5>
              <H5 style={{margin: 5}}>{this.iconForStatus(this.props.clientHostInfo.status)} {this.props.clientHostInfo.name}</H5>
            </Drawer>
          </NavbarGroup>
          }

        </Navbar>


      </ResizeSensor>
    );
  }

  private handleNavDrawerClose = () => {
    this.setState({showNavDrawer: false});
  }

  private handleShowNavDrawer = () => {
    this.setState({showNavDrawer: true});
  }

  private handleResize = (entries: IResizeEntry[]) => {
    if ((this.state.renderSmall) && (entries[0].contentRect.width > _minWidthToRenderFull)) {
      // **** change to full render ****

      this.setState({renderSmall: false});

      // **** done ***

      return;
    }

    if ((!this.state.renderSmall) && (entries[0].contentRect.width < _minWidthToRenderFull)) {
      // **** change to small render ****

      this.setState({renderSmall: true});

      // **** done ****

      return;
    }
  }

  private iconForStatus = (status: string) => {
    switch (status) {
      case 'connecting':
        return <Icon icon={IconNames.DOT} intent={Intent.NONE} iconSize={Icon.SIZE_LARGE} />;
      case 'testing':
        return <Icon icon={IconNames.DOT} intent={Intent.NONE} iconSize={Icon.SIZE_LARGE} />;
      case 'ok':
        return <Icon icon={IconNames.DOT} intent={Intent.PRIMARY} iconSize={Icon.SIZE_LARGE} />;
      case 'error':
          return <Icon icon={IconNames.DOT} intent={Intent.WARNING} iconSize={Icon.SIZE_LARGE} />;
      default:
          return <Icon icon={IconNames.DOT} intent={Intent.NONE} iconSize={Icon.SIZE_LARGE} />;
    }
  };


  private handleNavbarTabChange = (navbarTabId: TabId) => {
    this.props.onSelectedTabChanged(navbarTabId.toString());

    // **** close drawer if necessary ****

    if (this.state.showNavDrawer) {
      this.handleNavDrawerClose();
    }
  }
}
