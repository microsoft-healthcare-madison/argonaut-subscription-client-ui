import * as React from 'react';

import { 
  Card,
  H5, H6, 
  Icon,
  Intent,
  Spinner,
  Button,
  Tabs,
  Tab,
  TabId,
  Tooltip,
} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';
import { DataCardInfo } from '../models/DataCardInfo';
import { ScenarioStepData } from '../models/ScenarioStepData';
import { ScenarioDataPanel } from './ScenarioDataPanel';
import { ContentPaneProps } from '../models/ContentPaneProps';

export interface ScenarioStepProps {
  step: DataCardInfo,
  data: ScenarioStepData[],
  paneProps: ContentPaneProps,
}


/** Type definition for the current object's state variable */
interface ComponentState {
  showData: boolean,
  showStep: boolean,
  selectedTabId: string,
}

export class ScenarioStep extends React.PureComponent<ScenarioStepProps> {
  public state: ComponentState = {
    showData: true,
    showStep: true,
    selectedTabId: ''
  }

  componentWillReceiveProps(nextProps: ScenarioStepProps) {
    // **** check for tabs ****

    if ((nextProps.data) && (nextProps.data.length > 0)) {
      this.setState({selectedTabId: nextProps.data[nextProps.data.length-1].id});
    }
  }

  public render() {
    return (
      <Card>
        <Button
          onClick={this.handleToggleStepClick}
          minimal={true}
          style={{float: 'right'}}
          icon={this.state.showStep ? IconNames.CHEVRON_DOWN : IconNames.CHEVRON_RIGHT}
          />
        <H5>{this.iconForStep()} Step {this.props.step.stepNumber}{this.props.step.optional ? ' (Optional)' : ''}: {this.props.step.heading}</H5>
        {this.state.showStep &&
          <div>
            <H6>{this.props.step.description}</H6>
            {this.props.step.busy && 
              <Spinner />
            }
            {(!this.props.step.busy) &&
              this.props.children
            }
            <br />
            { (this.props.data.length > 0) &&
              <Tabs
                animate={true}
                vertical={true}
                selectedTabId={this.state.selectedTabId}
                onChange={this.handleTabChange}
                >
                <Tooltip content='Copy To Clipboard'>
                  <Button 
                    icon={IconNames.DUPLICATE} 
                    minimal 
                    style={{marginLeft:5, marginRight:0, marginTop:10}}
                    onClick={this.handleCopyClick}
                    />
                </Tooltip>
              {this.props.data.map((data) => (
               <Tab
                key={data.id}
                id={data.id}
                panel={<ScenarioDataPanel 
                  data={data} 
                  codePaneDark={this.props.paneProps.codePaneDark} 
                  />}
                >
                {data.iconName && <Icon icon={data.iconName} />} {data.title}
                </Tab>
              )
              )}
            </Tabs>
            }
          </div>
        }
      </Card>
    );
  }

  
  private handleCopyClick = () => {

    var currentData: string = '';
    var currentTitle: string = '';

    // **** figure out which data the user has selected ****

    this.props.data.forEach((data) => {
      if (data.id === this.state.selectedTabId) {
        currentData = data.data;
        currentTitle = data.title;
        return;
      }
    })

    this.props.paneProps.copyToClipboard(currentData, `'${currentTitle}' Copied to the ClipBoard`);
  }

	private handleTabChange = (navbarTabId: TabId) => {
		this.setState({selectedTabId: navbarTabId.toString()})
  }
  
  private handleToggleStepClick = () => {
    this.setState({showStep: !this.state.showStep})
  }

  private iconForStep = () => {
    if (this.props.step.completed) {
      return <Icon icon={IconNames.TICK} intent={Intent.SUCCESS} iconSize={Icon.SIZE_LARGE} />;
    }
    if (this.props.step.available) {
      return <Icon icon={IconNames.ARROW_RIGHT} intent={Intent.PRIMARY} iconSize={Icon.SIZE_LARGE} />;
    }
    return <Icon icon={IconNames.DISABLE} intent={Intent.WARNING} iconSize={Icon.SIZE_STANDARD} />;
  }
}

