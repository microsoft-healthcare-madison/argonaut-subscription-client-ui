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
  NavbarDivider,
  Tooltip,
} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';
import { ScenarioStepInfo } from '../models/ScenarioStepInfo';
import { ScenarioStepData } from '../models/ScenarioStepData';
import { ScenarioDataPanel } from './ScenarioDataPanel';

export interface ScenarioStepProps {
  step: ScenarioStepInfo,
  data: ScenarioStepData[],
  toaster: ((message: string, iconName?: string, timeout?: number) => void),
  codePaneDark: boolean,
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
            {this.props.step.showBusy && 
              <Spinner />
            }
            {(!this.props.step.showBusy) &&
              this.props.children
            }
            <br />
            { (this.props.data.length > 0) &&
              <Tabs
                animate={true}
                vertical={false}
                selectedTabId={this.state.selectedTabId}
                onChange={this.handleTabChange}
                >
                <Tooltip content='Copy To Clipboard'>
                  <Button icon={IconNames.DUPLICATE} minimal style={{marginLeft:5, marginRight:0, marginTop:10}}/>
                </Tooltip>
              {this.props.data.map((data) => (
                [ <NavbarDivider />,
                  <Tab
                    id={data.id}
                    panel={<ScenarioDataPanel 
                      data={data} 
                      codePaneDark={this.props.codePaneDark} 
                      />}
                    >
                    {data.iconName && <Icon icon={data.iconName} />} {data.title}
                    </Tab>
                ]
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

    // **** create a textarea so we can select our text ****

    var textArea = document.createElement("textarea");

    // **** set in top-left corner of screen regardless of scroll position ****

    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';

    // **** small as poosible - 1px / 1em gives a negative w/h on some browsers ****

    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // **** don't want padding or borders, reduce size in case it flash renders ****

    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // **** avoid flash of white box if rendered for any reason ****

    textArea.style.background = 'transparent';

    // **** set our text to our data ****

    textArea.value = currentData;

    // **** add to the DOM ****

    document.body.appendChild(textArea);

    // **** select our element and text ****

    textArea.focus();
    textArea.select();

    // **** copy, ignore errors ****

    try {
      document.execCommand('copy');
    } catch (err) {
    }
    
    // **** remove our textarea ****

    document.body.removeChild(textArea);

    // *** notify the user ****

    this.props.toaster(`Copied '${currentTitle}' to Clipboard.`, IconNames.CLIPBOARD);
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

