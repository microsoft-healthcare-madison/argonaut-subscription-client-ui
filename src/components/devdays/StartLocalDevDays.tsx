import React from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { Button } from '@blueprintjs/core';

export interface StartLocalDevDaysProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  data: SingleRequestData[],
  language: string,
  registerDone: (() => void),
}

/** Component representing the DevDays start local Card */
export default function StartLocalDevDays(props: StartLocalDevDaysProps) {

  const info: DataCardInfo = {
    id: 'devdays_start_local',
    heading: 'Start the local server',
    stepNumber: 7,
    description: '',
    optional: false,
  };

  function handleDone() {
    props.registerDone();
  }

  /** Return this component */
  return(
    <DataCard
      info={info}
      data={props.data}
      paneProps={props.paneProps}
      status={props.status}
      renderChildrenAfter={true}
      >
      <Button
        onClick={handleDone}
        disabled={!props.status.available}
        >
        Done!
      </Button>
    </DataCard>
  );
}