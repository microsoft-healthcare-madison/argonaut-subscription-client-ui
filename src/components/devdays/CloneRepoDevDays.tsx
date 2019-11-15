import React from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { Button } from '@blueprintjs/core';

export interface CloneRepoDevDaysProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  data: SingleRequestData[],
  language: string,
  registerCloned: (() => void),
}

/** Component representing the DevDays clone repo Card */
export default function CloneRepoDevDays(props: CloneRepoDevDaysProps) {

  const info: DataCardInfo = {
    id: 'devdays_clone_repo',
    heading: 'Clone the GitHub repo onto your local machine',
    stepNumber: 2,
    description: '',
    optional: false,
  };

  function handleDone() {
    props.registerCloned();
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