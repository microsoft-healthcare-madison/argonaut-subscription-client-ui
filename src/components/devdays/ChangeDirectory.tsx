import React from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { Button } from '@blueprintjs/core';

export interface ChangeDirectoryDevDaysProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  data: SingleRequestData[],
  registerDone: (() => void),
}

/** Component representing the DevDays change directory Card */
export default function ChangeDirectoryDevDays(props: ChangeDirectoryDevDaysProps) {

  const info: DataCardInfo = {
    id: 'devdays_change_directory',
    heading: 'Move into the cloned repo',
    stepNumber: 3,
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