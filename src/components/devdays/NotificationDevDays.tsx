import React from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';

export interface NotificationDevDaysProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  data: SingleRequestData[],
}

/** Component representing the Scenario 1 Handshake Card */
export default function NotificationDevDays(props: NotificationDevDaysProps) {

  const info: DataCardInfo = {
    id: 'devdays_notification',
    heading: 'Subscription Notifications',
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