import * as React from 'react';

import { 
  Card,
  H5, H6, 
  Icon,
  Intent,
  Spinner,
  Button,
} from '@blueprintjs/core';

import {IconNames} from '@blueprintjs/icons';
import { DataCardInfo } from '../models/DataCardInfo';
import { ContentPaneProps } from '../models/ContentPaneProps';
import { SingleRequestData, RenderDataAsTypes } from '../models/RequestData';
import RequestDataPanel from './RequestDataPanel';

export interface DataCardProps {
  info: DataCardInfo,
  data: SingleRequestData[],
  paneProps: ContentPaneProps,
  children?: React.ReactNode
}

export default function DataCard(props: DataCardProps) {

  const [showContent, toggleShowContent] = React.useState<boolean>(true);

  /** Function to toggle show/hide of this card's content */
  function handleToggleCardContentClick() {
    toggleShowContent(!showContent);
  }

  /** Function to get an appropriate icon for this card */
  function iconForCard() {
    if (props.info.busy) {
      return(<Spinner size={Spinner.SIZE_SMALL} />);
    }
    if (!props.info.stepNumber) {
      return(<Icon icon={IconNames.MINUS} iconSize={Icon.SIZE_LARGE} />);
    }
    if (props.info.completed) {
      return(<Icon icon={IconNames.TICK} intent={Intent.SUCCESS} iconSize={Icon.SIZE_LARGE} />);
    }
    if (props.info.available) {
      return(<Icon icon={IconNames.ARROW_RIGHT} intent={Intent.PRIMARY} iconSize={Icon.SIZE_LARGE} />);
    }
    return(<Icon icon={IconNames.DISABLE} intent={Intent.WARNING} iconSize={Icon.SIZE_STANDARD} />);
  }

  // **** return our component ****

  return (
    <Card key={props.info.id}>
      <Button
        onClick={handleToggleCardContentClick}
        minimal={true}
        style={{float: 'right'}}
        icon={showContent ? IconNames.CHEVRON_DOWN : IconNames.CHEVRON_RIGHT}
        />
      <div style={{float:'left', width: '20px', marginLeft: '5px', marginRight: '10px'}}>
        {iconForCard()}
      </div>
      <H5>{props.info.optional ? '(Optional) ':''}{props.info.heading}</H5>
      { showContent &&
        <div>
          <H6>{props.info.description}</H6>
          {props.children}
          <br />
          <RequestDataPanel
            paneProps={props.paneProps}
            data={props.data}
            />
        </div>
      }
    </Card>
  );
}


