import React from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';

export interface S1_HandshakeProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  data: SingleRequestData[],
}

/** Component representing the Scenario 1 Handshake Card */
export default function S1_Handshake(props: S1_HandshakeProps) {

  const info: DataCardInfo = {
    id: 's1_handshake',
    stepNumber: 5,
    heading: 'Wait on Endpoint Handshake',
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