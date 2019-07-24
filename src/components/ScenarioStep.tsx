import * as React from 'react';

import { 
  Flex, 
  Box 
} from 'reflexbox';

import { 
  Card,
  H5, H2, H6, 
  Blockquote,
  Classes,
  Icon,
  Intent,
} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';
import { UiTabInformation } from '../models/UiTabInformation';
import { ConnectionInformation } from '../models/ConnectionInformation';
import { ScenarioStepInfo } from '../models/ScenarioStepInfo';

export interface ScenarioStepProps {
  step: ScenarioStepInfo,
}

// interface ComponentState {
// 	step: ScenarioStepInfo,
// }

export class ScenarioStep extends React.PureComponent<ScenarioStepProps> {
  // public state: ComponentState = {
  //   step: {
  //     stepNumber: 0,
  //     heading: '',
  //     description: '',
  //     optional: false,
  //     available: false,
  //     completed: false,
  //     data: ''
  //   }
  // };

  // constructor(props: ScenarioStepProps) {
  //     super(props);
  // };

  public render() {
    return (
      <Box px={1} w={1} m={1}>
        <Card>
          <H5>{this.iconForStep()} Step {this.props.step.stepNumber}{this.props.step.optional ? ' (Optional)' : ''}: {this.props.step.heading}</H5>
          <H6>{this.props.step.description}</H6>
          {this.props.children}
          <Blockquote>
            {this.props.step.data}
          </Blockquote>
        </Card>
      </Box>
    );
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

