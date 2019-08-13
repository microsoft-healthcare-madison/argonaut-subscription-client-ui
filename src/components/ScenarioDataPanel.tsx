import * as React from 'react';

import { ScenarioStepData } from '../models/ScenarioStepData';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export interface ScenarioDataPanelProps {
  data: ScenarioStepData,
  codePaneDark: boolean,
}

/** Type definition for the current object's state variable */
interface ComponentState {
}

export class ScenarioDataPanel extends React.PureComponent<ScenarioDataPanelProps> {
  public state: ComponentState = {
  }

  public render() {
  return (
      <SyntaxHighlighter
        language='json'
        style={this.props.codePaneDark ? atomOneDark : atomOneLight}
        >
        {this.props.data.data}
      </SyntaxHighlighter>
    );
  }
}