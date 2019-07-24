import * as React from 'react';

import { 
  Flex, 
  Box 
} from 'reflexbox';

import { 
  Card,
  Button, 
  Collapse,
  Icon,
  InputGroup,
  Intent,
  FormGroup,
  Elevation,
  H2,
  Switch,
} from '@blueprintjs/core';

import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../models/ContentPaneProps';
import { ConnectionInformation } from '../models/ConnectionInformation';

interface ComponentState {

}

export class TriggerPane extends React.PureComponent<ContentPaneProps> {
  public state: ComponentState = {

  };

  // constructor(props: ContentPaneProps) {
  //   super(props);
  // }

  public render() {
    return (
      <Flex p={1} align='center' column>
        <Box px={1} w={1} m={5}>
          <Card elevation={Elevation.TWO}>
            <H2>Trigger Encounters for Patient</H2>
            <p>
              Generate a patient to match the given filter (if necessary), 
              then generate an Encounter for that patient.
            </p>
            <Switch>Repeat</Switch>
          </Card>
        </Box>

        <Box px={1} w={1} m={5}>
          <Card elevation={Elevation.TWO}>
            <H2>Trigger Encounters for Patients in Group</H2>
            <p>
              Generate patients to match the given filter, 
              then generate Encounters for those patients.
            </p>
            <Switch>Repeat</Switch>
          </Card>
        </Box>

      </Flex>
    );
  }

}
