import * as React from 'react';

import { 
  Card,
  H3, H6, 
  Icon,
  Spinner,
  Button,
  TabId,
  Tooltip,
  HTMLSelect,
} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';
import { TileInfo } from '../models/TileInfo';
import { TileDataPanel } from './TileDataPanel';

import * as fhir from '../models/fhir_r4_selected';
import { ContentPaneProps } from '../models/ContentPaneProps';

export interface NotificationTileProps {
  paneProps: ContentPaneProps,
  data: fhir.Bundle[],
}


/** Type definition for the current object's state variable */
interface ComponentState {
  info: TileInfo,
  showData: boolean,
  showTile: boolean,
  selectedTabId: string,
  isBusy: boolean,
  selectedDataRowIndex: number,
}

export class NotificationsTile extends React.PureComponent<NotificationTileProps> {
  public state: ComponentState = {
    info: {
      id: 'notificationsTile',
      name: 'Notifications',
      description: 'Area showing received Subscription Notifications',
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
    return (
      <Card>
        <Button
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
        <div>
          <H3>{this.state.info.name}</H3>
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
        {this.state.showTile &&
          <div>
            <HTMLSelect
              onChange={this.handleTileDataRowChange}
              defaultValue=''
              >
              <option value=''>Most Recent</option>
              {this.props.data.map((data: fhir.Bundle, index: number) => (
                <option value={index.toString()}>Notification #{index}</option>
              )
              )}
            </HTMLSelect>
            <H6>{this.state.info.description}</H6>
            <br />
            {/* Show the code pane based on the selected row (if necessary) */}
            { (haveData) &&
              <TileDataPanel
                data={JSON.stringify(this.props.data[dataRowIndex], null, 2)}
                codePaneDark={this.props.paneProps.codePaneDark}
                />
            }
          </div>
        }
      </Card>
    );
  }

  private handleTileDataRowChange = (event: React.FormEvent<HTMLSelectElement>) => {
    var selectedRow: number;
    // **** check for special rows ****

    if (event.currentTarget.value === '') {
      // **** user selected 'most recent' ****

      selectedRow = -1;
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
  
  private handleCopyClick = () => {

    // **** figure out which data the user has selected ****

    const dataRowIndex:number = (this.state.selectedDataRowIndex == -1)
    ? this.props.data.length - 1
    : this.state.selectedDataRowIndex;

    const currentData: string = JSON.stringify(this.props.data[dataRowIndex], null, 2);
    const currentTitle: string = this.state.info.name;

    this.props.paneProps.copyToClipboard(currentData, currentTitle);
  }

	private handleTabChange = (navbarTabId: TabId) => {
		this.setState({selectedTabId: navbarTabId.toString()})
  }
  
  private handleToggleTileClick = () => {
    this.setState({showTile: !this.state.showTile})
  }
}

