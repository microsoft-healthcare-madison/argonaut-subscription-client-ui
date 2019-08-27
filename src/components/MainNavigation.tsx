import React, {useState} from 'react';

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
} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';
import { UiTabInformation } from '../models/UiTabInformation';
import { ConnectionInformation } from '../models/ConnectionInformation';

/** Interface for the MainNavigation component properties */
export interface MainNavigationProps {
  tabs: UiTabInformation[];
  selectedTabId: string;
  onSelectedTabChanged: ((id: string) => void);
  fhirServerInfo: ConnectionInformation;
  clientHostInfo: ConnectionInformation;
}

/** Minimum width to render the full menu */
const _minWidthToRenderFull: number = 900;

export default function MainNavigation(props: MainNavigationProps) {
  // **** set up local state ****

  const [renderSmall, setRenderSmall] = useState<boolean>(false);
  const [showNavDrawer, setShowNavDrawer] = useState<boolean>(false);

  /** Function to handle requests to close the nav drawer */
  function handleNavDrawerClose() {
    setShowNavDrawer(false);
  }

  /** Function to handle requests to open the nav drawer */
  function handleShowNavDrawer() {
    setShowNavDrawer(true);
  }

  /** Function to handle resize events on the nav bar */
  function handleResize(entries: IResizeEntry[]) {
    if ((renderSmall) && (entries[0].contentRect.width > _minWidthToRenderFull)) {
      // **** change to full render ****
 
      setRenderSmall(false);
      return;
    }

    if ((!renderSmall) && (entries[0].contentRect.width < _minWidthToRenderFull)) {
      // **** change to small render ****

      setRenderSmall(true);
      return;
    }
  }

  /** Function to get the appropriate icon for server connection states */
  function iconForStatus(status: string) {
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

  /** Function to handle nav bar tab changes (notify main page and close nav drawer) */
  function handleNavbarTabChange(navbarTabId: TabId) {
    props.onSelectedTabChanged(navbarTabId.toString());
    if (showNavDrawer) {
      handleNavDrawerClose();
    }
  }

  // **** render this component ****

  return(
    <ResizeSensor onResize={handleResize}>
      <Navbar className={Classes.DARK}>
        {/* Left side of nav-bar desktop */}
        { !renderSmall &&
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>Argonaut Subscriptions Client</NavbarHeading>
          <NavbarDivider />
          <Tabs
              animate={true}
              id='navbar'
              large={true}
              onChange={handleNavbarTabChange}
              selectedTabId={props.selectedTabId}
              vertical={false}
              >
              { // **** add our tabs ****
                props.tabs.map((tab) => (
                  <Tab key={tab.id} id={tab.id}>
                      {tab.title}
                  </Tab>
                ))
              }
            </Tabs>
        </NavbarGroup>
        }

        {/* Left side of nav-bar mobile */}
        { renderSmall &&
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>Subscriptions</NavbarHeading>
        </NavbarGroup>
        }

        {/* Right side of nav-bar desktop */}
        { !renderSmall &&
        <NavbarGroup align={Alignment.RIGHT}>
          <NavbarHeading>{iconForStatus(props.fhirServerInfo.status)} {props.fhirServerInfo.name}</NavbarHeading>
          <NavbarHeading>{iconForStatus(props.clientHostInfo.status)} {props.clientHostInfo.name}</NavbarHeading>
        </NavbarGroup>
        }

        {/* Right side of nav-bar mobile */}
        { renderSmall &&
        <NavbarGroup align={Alignment.RIGHT}>
          <AnchorButton
            icon={IconNames.MENU}
            onClick={handleShowNavDrawer}
            />
          <Drawer
            isOpen={showNavDrawer}
            canEscapeKeyClose={true}
            autoFocus={true}
            hasBackdrop={true}
            position={Position.LEFT}
            usePortal={true}
            onClose={handleNavDrawerClose}
            size={Drawer.SIZE_LARGE}
            className={Classes.DARK}
            >
            <Tabs
              animate={true}
              id='navbar'
              large={true}
              onChange={handleNavbarTabChange}
              selectedTabId={props.selectedTabId}
              vertical={true}
              >
              { // **** add our tabs ****
                props.tabs.map((tab) => (
                  <Tab key={tab.id} id={tab.id} title={tab.title}/>
                ))
              }
            </Tabs>
            <br />
            <H5 style={{margin: 5}}>{iconForStatus(props.fhirServerInfo.status)} {props.fhirServerInfo.name}</H5>
            <H5 style={{margin: 5}}>{iconForStatus(props.clientHostInfo.status)} {props.clientHostInfo.name}</H5>
          </Drawer>
        </NavbarGroup>
        }
      </Navbar>
    </ResizeSensor>
  );
}