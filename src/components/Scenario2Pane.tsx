import * as React from 'react';

import { 
  Flex, 
  Box 
} from 'reflexbox';

import { 
  Button, 
  Collapse,
  Icon,
  InputGroup,
  Intent,
  
} from '@blueprintjs/core';

import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../models/ContentPaneProps';

export class Scenario2Pane extends React.PureComponent<ContentPaneProps> {
  public state = {
      isOpen : false,
  };

  public render() {
    return (
      <Flex p={1} align='center' column>
        <Box px={1} w={1}>
          <h5>Scenario Two</h5>
        </Box>
      </Flex>
    );
  }

  private handleClick = () => {
    this.setState({isOpen: !this.state.isOpen});
}
}
