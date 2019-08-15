import * as React from 'react';

// import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../models/ContentPaneProps';
import { Card } from '@blueprintjs/core';

export class Scenario2Pane extends React.PureComponent<ContentPaneProps> {
  public state = {
      isOpen : false,
  };

  public render() {
    return (
      <Card>
        <h5>Not Yet Implemented</h5>
      </Card>

    );
  }

  private handleClick = () => {
    this.setState({isOpen: !this.state.isOpen});
}
}
