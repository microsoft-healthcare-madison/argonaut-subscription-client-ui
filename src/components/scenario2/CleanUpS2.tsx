import React from 'react';

import {
  Button,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';

export interface CleanUpS2Props {
  paneProps: ContentPaneProps,
  cleanUp: (() => void),
  status: DataCardStatus,
  data: SingleRequestData[],
}

/** Component representing the Scenario 2 Clean Up Card */
export default function CleanUpS2(props: CleanUpS2Props) {

  const info: DataCardInfo = {
    id: 's2_cleanup',
    stepNumber: 1,
    heading: 'Clean up resources allocated during testing (subscriptions, endpoints, etc.).',
    description: '',
    optional: true,
  };

  /** Return this component */
  return(
    <DataCard
      info={info}
      status={props.status}
      data={props.data}
      paneProps={props.paneProps}
      >
      <Button
        disabled={(!props.status.available) || (props.status.busy)}
        onClick={props.cleanUp}
        >
        Go
      </Button>
    </DataCard>
  );
}