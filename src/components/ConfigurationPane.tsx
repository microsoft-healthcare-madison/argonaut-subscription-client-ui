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
} from '@blueprintjs/core';

import {IconNames} from "@blueprintjs/icons";
import { ContentPaneProps } from '../models/ContentPaneProps';
import { ConnectionInformation } from '../models/ConnectionInformation';

interface ComponentState {
  fhirServerUrl: string;
  clientHostUrl: string;
}

export class ConfigurationPane extends React.PureComponent<ContentPaneProps> {
  public state: ComponentState = {
      fhirServerUrl: '',
      clientHostUrl: ''
  };

  constructor(props: ContentPaneProps) {
    super(props);
    
    this.state.fhirServerUrl = props.fhirServerInfo.url;
    this.state.clientHostUrl = props.clientHostInfo.url;
  }

  public render() {
    return (
      <Flex p={1} align='center' column>
        <Box px={1} w={1}>
          <Card elevation={Elevation.TWO}>
            <FormGroup
              label = {this.props.fhirServerInfo.name + ' URL'}
              helperText = {this.props.fhirServerInfo.hint}
              labelFor='fhir-server-url'
              >
              <InputGroup 
                id='fhir-server-url'
                value={this.state.fhirServerUrl}
                onChange={this.handleFhirServerUrlChange}
                />
            </FormGroup>

            <p>
              <Button
                onClick={this.handleTestFhirServerClick}
                >
                Test FHIR Server
              </Button>
            </p>

            <FormGroup
              label = {this.props.clientHostInfo.name + ' URL'}
              helperText = {this.props.clientHostInfo.hint}
              labelFor='fhir-client-url'
              >
              <InputGroup 
                id='fhir-client-url'
                value={this.state.clientHostUrl}
                onChange={this.handleClientHostUrlChange}
                />
            </FormGroup>

            <p>
              <Button
                onClick={this.handleConnectToClientHostClick}
                >
                Connect to Client Host
              </Button>
            </p>

          </Card>
        </Box>
      </Flex>
    );
  }

  private handleFhirServerUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({fhirServerUrl: event.target.value})
  }

  private handleClientHostUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({clientHostUrl: event.target.value})
  }

  private handleConnectToClientHostClick = () => {
    var updatedInfo: ConnectionInformation = {...this.props.clientHostInfo, 
      url: this.state.clientHostUrl,
      status: 'ok'
    };
    this.props.updateClientHostInfo(updatedInfo);
  }

  private handleTestFhirServerClick = () => {
    var updatedInfo: ConnectionInformation = {...this.props.fhirServerInfo, 
      url: this.state.fhirServerUrl,
      status: 'ok'
    };
    this.props.updateFhirServerInfo(updatedInfo);
  }
}
