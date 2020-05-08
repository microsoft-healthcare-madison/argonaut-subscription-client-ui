import React, { useEffect, useState } from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { Button } from '@blueprintjs/core';
import { EndpointRegistration } from '../../models/EndpointRegistration';

export interface SetEndpointDevDaysProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  data: SingleRequestData[],
  registerDone: (() => void),
  endpoints: EndpointRegistration[],
  endpointCodeLineNumber: number,
  endpointCodeFilename: string,
}

/** Component representing the DevDays set endpoint Card */
export default function SetEndpointDevDays(props: SetEndpointDevDaysProps) {

  const _info: DataCardInfo = {
    id: 'devdays_set_endpoint',
    heading: 'Set the endpoint in the sample code',
    stepNumber: 6,
    description: 'This step lets the software know you are using our public proxy (sets the proxy URL for the subscription endpoint)',
    optional: false,
  };

  const [info, setInfo] = useState<DataCardInfo>(_info);

  useEffect(() => {
    if ((props.endpoints.length > 0) && (info.optional)) {
      setInfo({...info, optional: false});
    }
  }, [props.endpoints]);

  useEffect(() => {
    if (props.endpointCodeLineNumber < 1) {
      setInfo({...info, 
        description: 'This step lets the software know you are using our public proxy (sets the proxy URL for the subscription endpoint)'
      });
      return;
    }

    setInfo({...info,
      description: `Change line ${props.endpointCodeLineNumber} in the file '${props.endpointCodeFilename}' to the following value:`
    });
  }, [props.endpointCodeLineNumber, props.endpointCodeFilename]);

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