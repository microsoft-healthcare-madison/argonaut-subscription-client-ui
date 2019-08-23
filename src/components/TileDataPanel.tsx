import * as React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export interface TileDataPanelProps {
  data: string,
  codePaneDark: boolean,
}

/** Type definition for the current object's state variable */
interface ComponentState {
}

export class TileDataPanel extends React.PureComponent<TileDataPanelProps> {
  public state: ComponentState = {
  }

  public render() {
  return (
      <SyntaxHighlighter
        language='json'
        style={this.props.codePaneDark ? atomOneDark : atomOneLight}
        >
        {this.props.data}
      </SyntaxHighlighter>
    );
  }
}