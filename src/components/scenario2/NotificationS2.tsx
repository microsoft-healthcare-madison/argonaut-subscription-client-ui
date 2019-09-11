import React from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';

export interface NotificationS2Props {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  data: SingleRequestData[],
}

/** Component representing the Scenario 2 Notification Card */
export default function NotificationS2(props: NotificationS2Props) {

  const info: DataCardInfo = {
    id: 's2_notification',
    stepNumber: 7,
    heading: 'Wait on Subscription notification',
    description: '',
    optional: false,
  };
  
  /** Return this component */
  return(
    <DataCard
      info={info}
      data={props.data}
      paneProps={props.paneProps}
      status={props.status}
      >
    </DataCard>
  );
}