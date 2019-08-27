import * as React from 'react';

import { 
  Card,
  H3, H6, 
  Icon,
  Spinner,
  Button,
  Tabs,
  Tab,
  TabId,
  Tooltip,
  HTMLSelect,
} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';
import { TileDataPanel } from './TileDataPanel';

import * as fhir from '../models/fhir_r4_selected';
import { ContentPaneProps } from '../models/ContentPaneProps';
import { DataCardInfo } from '../models/DataCardInfo';
import { SingleRequestData } from '../models/RequestData';

export interface SubscriptionTileData {
  subscription: fhir.Subscription,
  tileData: SingleRequestData,
}

export interface SubscriptionTileProps {
  paneProps: ContentPaneProps,
  data: SubscriptionTileData[],
}


/** Type definition for the current object's state variable */
interface ComponentState {
  info: DataCardInfo,
  showData: boolean,
  showTile: boolean,
  selectedTabId: string,
  isBusy: boolean,
  selectedDataRowIndex: number,
}

export class SubscriptionTile extends React.PureComponent<SubscriptionTileProps> {
  public state: ComponentState = {
    info: {
      id:'subscriptions',
      heading: 'Subscriptions',
      description: 'Area to create/delete Subscription resources',
      busy: false,
    },
    showData: true,
    showTile: true,
    selectedTabId: '',
    isBusy: false,
    selectedDataRowIndex: 0,
  }

  public render() {
    const haveData:boolean = (this.props.data.length > 0);
    const dataRowIndex:number = (this.state.selectedDataRowIndex === -1)
      ? this.props.data.length - 1
      : this.state.selectedDataRowIndex;
    const showCreateNewArea:boolean = (this.state.selectedDataRowIndex === -2);
    return (
      <Card>
        {/* <Button
          onClick={this.handleToggleTileClick}
          minimal={true}
          style={{float: 'right'}}
          icon={this.state.showTile ? IconNames.CHEVRON_DOWN : IconNames.CHEVRON_RIGHT}
          />
        <div style={{float:'left', width: '20px', marginLeft: '5px', marginRight: '10px'}}>
          {this.state.isBusy && 
            <Spinner size={Spinner.SIZE_SMALL} />
          }
          {!this.state.isBusy &&
            <Icon icon={IconNames.MINUS} iconSize={Icon.SIZE_LARGE} />
          }
        </div>
        <H3>{this.state.info.name}</H3>
        {this.state.showTile &&
          <div>
            <HTMLSelect
              onChange={this.handleTileDataRowChange}
              defaultValue=''
              >
              <option value='tileCreateNewRecord'>Create New</option>
              {this.props.data.map((data: SubscriptionTileData, index: number) => (
                <option value={index.toString()}>{data.subscription.name}</option>
              )
              )}
            </HTMLSelect>
            <H6>{this.state.info.description}</H6>
            {this.props.children}
            <br />
            { // Show the new record info (if necessary) }
            { (showCreateNewArea) &&
              <div>New record form goes here</div>
            }
            { // Show the tab selector based on the selected row (if necessary) }
            { ((!showCreateNewArea) && (haveData)) &&
              <Tabs
                animate={true}
                vertical={true}
                selectedTabId={this.state.selectedTabId}
                onChange={this.handleTabChange}
                >
                <div>
                  <Tooltip content='Delete'>
                    <Button 
                        icon={IconNames.DELETE} 
                        minimal 
                        style={{marginLeft:5, marginRight:5, marginTop:10}}
                        onClick={this.handleDeleteClick}
                        />
                  </Tooltip>
                  <Tooltip content='Copy To Clipboard'>
                    <Button 
                      icon={IconNames.DUPLICATE} 
                      minimal 
                      style={{marginLeft:5, marginRight:5, marginTop:10}}
                      onClick={this.handleCopyClick}
                      />
                  </Tooltip>
                </div>
                <Tab
                  key='request_url'
                  id='request_url'
                  panel={<TileDataPanel 
                    data={this.props.data[dataRowIndex].tileData.requestUrl} 
                    codePaneDark={this.props.paneProps.codePaneDark} 
                    />}
                  >
                  <Icon icon={IconNames.GLOBE_NETWORK} /> Request URL
                </Tab>
                <Tab
                  key='request_data'
                  id='request_data'
                  panel={<TileDataPanel 
                    data={this.props.data[dataRowIndex].tileData.requestData} 
                    codePaneDark={this.props.paneProps.codePaneDark} 
                    />}
                  >
                  <Icon icon={this.iconNameForType(this.props.data[dataRowIndex].tileData.requestDataType)} /> Request Data
                </Tab>
                <Tab
                  key='response_data'
                  id='response_data'
                  panel={<TileDataPanel 
                    data={this.props.data[dataRowIndex].tileData.responseData} 
                    codePaneDark={this.props.paneProps.codePaneDark} 
                    />}
                  >
                  <Icon icon={this.iconNameForType(this.props.data[dataRowIndex].tileData.responseDataType)} /> Response Data
                </Tab>
              </Tabs>
            }
          </div>
        } */}
      </Card>
    );
  }

  private handleTileDataRowChange = (event: React.FormEvent<HTMLSelectElement>) => {
    var selectedRow: number;
    // **** check for special rows ****

    if (event.currentTarget.value === 'tileCreateNewRecord') {
      // **** user selected 'create new record' ****

      selectedRow = -2;
    } else {
      // **** user selected a row ****
      
      selectedRow = parseInt(event.currentTarget.value);
    }

		this.setState({selectedDataRowIndex: selectedRow})
	}

  private handleDeleteClick = () => {
   
    // *** notify the user ****

    this.props.paneProps.toaster(`Deleted '???'.`, IconNames.DELETE); 
  }
  
	private handleTabChange = (navbarTabId: TabId) => {
		this.setState({selectedTabId: navbarTabId.toString()})
  }
  
  private handleToggleTileClick = () => {
    this.setState({showTile: !this.state.showTile})
  }
}
