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
  Button,
  Tabs,
  Tab,
  TabId,
  NavbarDivider,
} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';
import { ScenarioStepInfo } from '../models/ScenarioStepInfo';
import { ScenarioStepData } from '../models/ScenarioStepData';
import { ScenarioDataPanel } from './ScenarioDataPanel';

export interface ScenarioStepProps {
  step: ScenarioStepInfo,
  data: ScenarioStepData[],
  toaster: ((message: string, iconName?: string, timeout?: number) => void)
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
      <Box px={1} w={1} m={1}>
        {/* interactive={true} onClick={this.handleToggleStepClick} */}
        <Card>
          <Button
            onClick={this.handleToggleStepClick}
            minimal={true}
            style={{margin: 5, float: 'right'}}
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
                {this.props.data.map((data) => (
                  [ <NavbarDivider />,
                    <Tab
                      id={data.id}
                      panel={<ScenarioDataPanel data={data} toaster={this.props.toaster} />}
                      >
                      {data.iconName && <Icon icon={data.iconName} />} {data.title}
                      </Tab>
                  ]
                )

                )}
              </Tabs>
              
              }
              {/* { (this.props.step.data && this.state.showData) &&
                <div>
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
                <Button
                  onClick={this.handleToggleDataClick}
                  minimal={true}
                  style={{margin: 5}}
                  icon={this.state.showData ? IconNames.CHEVRON_DOWN : IconNames.CHEVRON_RIGHT}
                  />
              </div>
              } */}
            </div>
          }
        </Card>
      </Box>
    );
  }

	private handleTabChange = (navbarTabId: TabId) => {
		this.setState({selectedTabId: navbarTabId.toString()})
  }
  
  private handleToggleStepClick = () => {
    this.setState({showStep: !this.state.showStep})
  }

  private handleToggleDataClick = () => {
    this.setState({showData: !this.state.showData})
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

