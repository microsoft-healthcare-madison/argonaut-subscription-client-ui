import * as React from 'react';

import { 
  Box 
} from 'reflexbox';

import { 
  Card,
  H5, H6, 
  Icon,
  Intent,
  Spinner,
  Pre,
  Button,
  Tooltip,
} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';
import { ScenarioStepInfo } from '../models/ScenarioStepInfo';

export interface ScenarioStepProps {
  step: ScenarioStepInfo
}


/** Type definition for the current object's state variable */
interface ComponentState {
	showData: boolean,
}


export class ScenarioStep extends React.PureComponent<ScenarioStepProps> {
  public state: ComponentState = {
    showData: true,
  }

  public render() {
    return (
      <Box px={1} w={1} m={1}>
        <Card>
          <H5>{this.iconForStep()} Step {this.props.step.stepNumber}{this.props.step.optional ? ' (Optional)' : ''}: {this.props.step.heading}</H5>
          <H6>{this.props.step.description}</H6>
          {this.props.step.showBusy && 
            <Spinner />
          }
          {(!this.props.step.showBusy) &&
            this.props.children
          }
          { this.props.step.data &&
          <div>
            <Button
              onClick={this.handleToggleDataClick}
              minimal={true}
              style={{margin: 5}}
              icon={this.state.showData ? IconNames.CHEVRON_DOWN : IconNames.CHEVRON_RIGHT}
              />
            <Tooltip
              content='Copy to Clipboard'
              >
              <Button
                onClick={this.handleCopyClick}
                minimal={true}
                style={{margin: 5}}
                icon={IconNames.DUPLICATE}
                />
            </Tooltip>
          </div>
          }
          { (this.props.step.data && this.state.showData) &&
            <Pre style={{margin: 5}}>
              {this.props.step.data}
            </Pre>
          }
        </Card>
      </Box>
    );
  }

  private handleCopyClick = () => {
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

    textArea.value = this.props.step.data;

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
  }

  private handleToggleDataClick = () => {
    this.setState({showData: !this.state.showData})
  }

  private iconForStep = () => {
    if (this.props.step.completed) {
      return <Icon icon={IconNames.TICK} intent={Intent.SUCCESS} iconSize={Icon.SIZE_LARGE} />;
    }
    if (this.props.step.available) {
      return <Icon icon={IconNames.CARET_RIGHT} intent={Intent.PRIMARY} iconSize={Icon.SIZE_LARGE} />;
    }
    return <Icon icon={IconNames.DISABLE} intent={Intent.WARNING} iconSize={Icon.SIZE_STANDARD} />;
  }
}

