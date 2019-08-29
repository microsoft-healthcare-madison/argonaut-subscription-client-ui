import React from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';

export interface S1_NotificationProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  data: SingleRequestData[],
}

/** Component representing the Scenario 1 Handshake Card */
export default function S1_Notification(props: S1_NotificationProps) {

  const info: DataCardInfo = {
    id: 's1_notification',
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