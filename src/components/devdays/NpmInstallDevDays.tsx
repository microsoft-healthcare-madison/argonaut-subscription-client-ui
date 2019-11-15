import React from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { Button } from '@blueprintjs/core';

export interface NpmInstallDevDaysProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  data: SingleRequestData[],
  registerDone: (() => void),
}

/** Component representing the DevDays npm install Card */
export default function NpmInstallDevDays(props: NpmInstallDevDaysProps) {

  const info: DataCardInfo = {
    id: 'devdays_npm_install',
    heading: 'Install node module dependencies',
    stepNumber: 4,
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