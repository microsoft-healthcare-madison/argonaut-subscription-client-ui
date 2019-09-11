import React, {useState, useEffect} from 'react';

import {
  Button, Tabs, Tab, Tooltip, TabId, Icon, Switch, 
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { IconNames } from '@blueprintjs/icons';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export interface RequestPanelProps {
  paneProps: ContentPaneProps,
  data: SingleRequestData[],
  busy?: boolean,
  processRowDelete?: ((index: number) => void),
  processRowToggle?: ((index: number) => void),
  selectedDataRowIndex?: number,
  tabButtonText?: string,
  tabButtonHandler?: ((index: number) => void),
}

export default function RequestDataPanel(props: RequestPanelProps) {

  const [selectedTabId, setSelectedTabId] = useState<string>('');
  const [displayedTabId, setDisplayedTabId] = useState<string>('');

  const dataRowIndex:number = ((props.selectedDataRowIndex === undefined) || (props.selectedDataRowIndex === -1))
    ? (props.data ? props.data.length - 1 : -1 )
    : props.selectedDataRowIndex!;

  useEffect(() => {
    if ((selectedTabId === displayedTabId) && (selectedTabId !== '')) {
      return;
    }

    if ((!props.data) || (props.data.length === 0)) {
      setDisplayedTabId('');
      return;
    }

    if (selectedTabId !== '') {
      setDisplayedTabId(selectedTabId);
    }
      
    if (selectedTabId === '') {
      if (props.data[dataRowIndex].info) {
        setDisplayedTabId('info');
      } else if (props.data[dataRowIndex].responseData) {
        setDisplayedTabId('response_data');
      } else if (props.data[dataRowIndex].outcome) {
        setDisplayedTabId('outcome');
      } else if (props.data[dataRowIndex].requestData) {
        setDisplayedTabId('request_data');
      } else if (props.data[dataRowIndex].requestUrl) {
        setDisplayedTabId('request_url');
      }
    }
  }, [props.data, selectedTabId, displayedTabId, dataRowIndex]);

  // **** check for no data ****

  if ((!props.data) || (props.data.length === 0)) {
    return(null);
  }

  /** Function to get an appropriate Icon based on data type */
  function iconNameForType(dataType: RenderDataAsTypes) {
    switch (dataType)
    {
      case RenderDataAsTypes.None: return IconNames.MINUS; //break;
      case RenderDataAsTypes.FHIR: return IconNames.FLAME; //break;
      case RenderDataAsTypes.JSON: return IconNames.ALIGN_JUSTIFY; //break;
      case RenderDataAsTypes.Error: return IconNames.ERROR; //break;
      case RenderDataAsTypes.Text: return IconNames.LABEL; //break;
      default: return IconNames.LABEL; //break;
    }
  }

  /** Function to handle tab selection changes */
  function handleTabChange(navbarTabId: TabId) {
    setSelectedTabId(navbarTabId.toString());
  }

  /** Function to handle copy requests - grab data from the correct pane and forward request */
  function handleCopyClick() {
    switch (displayedTabId)
    {
      case 'request_url':
        props.paneProps.copyToClipboard(props.data[dataRowIndex].requestUrl!, 'Request URL');
        return;
        // break;
      case 'request_data':
        props.paneProps.copyToClipboard(props.data[dataRowIndex].requestData!, 'Request Data');
        return;
        // break;
      case 'response_data':
        props.paneProps.copyToClipboard(props.data[dataRowIndex].responseData!, 'Response Data');
        return;
        // break;
      case 'info':
        props.paneProps.copyToClipboard(props.data[dataRowIndex].info!, 'Info');
        return;
        // break;
      case 'outcome':
        props.paneProps.copyToClipboard(props.data[dataRowIndex].outcome!, 'OperationOutcome');
        return;
        // break;
    }
  }

  /** Function to handle delete requests - grab the index and forward request */
  function handleDeleteClick() {
    props.processRowDelete!(dataRowIndex);
  }

  function handleToggle() {
    props.processRowToggle!(dataRowIndex);
  }

  function handleTabButtonClick() {
    props.tabButtonHandler!(dataRowIndex);
  }

  /** Return this component */
  return(
    <Tabs
      animate={true}
      vertical={true}
      selectedTabId={displayedTabId}
      onChange={handleTabChange}
      >
      <div>
        <Tooltip content='Copy To Clipboard'>
          <Button 
            icon={IconNames.DUPLICATE} 
            minimal 
            style={{marginLeft:5, marginRight:5, marginTop:10}}
            onClick={handleCopyClick}
            />
        </Tooltip>
        { (props.processRowDelete !== undefined) &&
          <Tooltip content='Delete'>
            <Button 
              icon={IconNames.DELETE} 
              minimal 
              style={{marginLeft:5, marginRight:5, marginTop:10}}
              onClick={handleDeleteClick}
              />
          </Tooltip>
        }
      </div>
      { (props.processRowToggle !== undefined) &&
        <div>
          <Switch
            disabled={props.busy}
            checked={props.data[dataRowIndex].enabled}
            label='Enabled' 
            onChange={handleToggle}
            />
        </div>
      }
      { ((props.tabButtonText !== undefined) && (props.tabButtonHandler !== undefined)) &&
        <div>
          <Button
            disabled={props.busy}
            text={props.tabButtonText!}
            onClick={handleTabButtonClick}
            />
        </div>
      }
      { (props.data[dataRowIndex].requestUrl !== undefined) &&
        <Tab
          key='request_url'
          id='request_url'
          panel={
            <SyntaxHighlighter
              className='codeTab'
              language='json'
              style={props.paneProps.codePaneDark ? atomOneDark : atomOneLight}
              >
              {props.data[dataRowIndex].requestUrl!}
            </SyntaxHighlighter>
            }
          >
          <Icon icon={IconNames.GLOBE_NETWORK} /> Request URL
        </Tab>
      }
      { (props.data[dataRowIndex].requestData !== undefined) &&
        <Tab
          key='request_data'
          id='request_data'
          panel={
            <SyntaxHighlighter
              className='codeTab'
              language='json'
              style={props.paneProps.codePaneDark ? atomOneDark : atomOneLight}
              >
              {props.data[dataRowIndex].requestData!}
            </SyntaxHighlighter>
            }
          >
          <Icon icon={iconNameForType(props.data[dataRowIndex].requestDataType!)} /> Request Data
        </Tab>
      }
      { (props.data[dataRowIndex].outcome !== undefined) &&
        <Tab
          key='outcome'
          id='outcome'
          panel={
            <SyntaxHighlighter
              className='codeTab'
              language='json'
              style={props.paneProps.codePaneDark ? atomOneDark : atomOneLight}
              >
              {props.data[dataRowIndex].outcome!}
            </SyntaxHighlighter>
            }
          >
          <Icon icon={IconNames.FLAME} /> Outcome
        </Tab>
      }
      { (props.data[dataRowIndex].responseData !== undefined) &&
        <Tab
          key='response_data'
          id='response_data'
          panel={
            <SyntaxHighlighter
              className='codeTab'
              language='json'
              style={props.paneProps.codePaneDark ? atomOneDark : atomOneLight}
              >
              {props.data[dataRowIndex].responseData!}
            </SyntaxHighlighter>
            }
          >
          <Icon icon={iconNameForType(props.data[dataRowIndex].responseDataType!)} /> Response Data
        </Tab>
      }
      { (props.data[dataRowIndex].info !== undefined) &&
        <Tab
          key='info'
          id='info'
          panel={
            <SyntaxHighlighter
              className='codeTab'
              language='json'
              style={props.paneProps.codePaneDark ? atomOneDark : atomOneLight}
              >
              {props.data[dataRowIndex].info!}
            </SyntaxHighlighter>
            }
          >
          <Icon icon={IconNames.INFO_SIGN} /> Info
        </Tab>
      }
    </Tabs>
  );
}