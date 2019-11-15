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
  registerStarted: (() => void),
}

/** Component representing the DevDays start local Card */
export default function StartLocalDevDays(props: StartLocalDevDaysProps) {

  const info: DataCardInfo = {
    id: 'devdays_start_local',
    heading: 'Start the local server',
    stepNumber: 5,
    description: '',
    optional: false,
  };

  function handleDone() {
    props.registerStarted();
  }

  /** Return this component */
  return(
    <DataCard
      info={info}
      data={props.data}
      paneProps={props.paneProps}
      status={props.status}
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