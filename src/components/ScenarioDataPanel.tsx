import * as React from 'react';
import { Card, H6, Tooltip, Button, Pre, } from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';
import { ScenarioStepData } from '../models/ScenarioStepData';

export interface ScenarioDataPanelProps {
  data: ScenarioStepData
}

/** Type definition for the current object's state variable */
interface ComponentState {
}

export class ScenarioDataPanel extends React.PureComponent<ScenarioDataPanelProps> {
  public state: ComponentState = {
  }

  public render() {
    return (
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
        <Pre style={{margin: 5}}>
          {this.props.data.data}
        </Pre>
      </div>
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

    textArea.value = this.props.data.data;

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

}