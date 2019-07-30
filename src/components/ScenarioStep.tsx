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
          } { this.props.step.data &&
            <Button
              onClick={this.handleToggleDataClick}
              minimal={true}
              style={{margin: 5}}
              icon={this.state.showData ? IconNames.CHEVRON_DOWN : IconNames.CHEVRON_RIGHT}
              />
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

