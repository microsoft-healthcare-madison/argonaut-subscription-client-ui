import React, {useEffect, useRef} from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import { ApiHelper } from '../../util/ApiHelper';
import { Button } from '@blueprintjs/core';

export interface EndpointPlaygroundProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  endpoints: EndpointRegistration[],
  registerEndpoint: ((endpoint: EndpointRegistration) => void),
}

/** Component representing the Playground Endpoint Card */
export default function EndpointPlayground(props: EndpointPlaygroundProps) {

  const info: DataCardInfo = {
    id: 'playground_endpoint',
    heading: 'Client / Host - REST Endpoint Interactions',
    description: '',
    optional: false,
  };

  const endpointCountRef = useRef<number>(0);

  /** Create an endpoint */
  function createEndpoint() {
    props.updateStatus({...props.status, busy: true});

    // **** build the url for our call ***

    let url: string = new URL(
      `api/Clients/${props.paneProps.clientHostInfo.registration}/Endpoints/REST/`, 
      props.paneProps.clientHostInfo.url
      ).toString();

    // **** ask for this endpoint to be created ****

    ApiHelper.apiPost<EndpointRegistration>(url, '')
      .then((value: EndpointRegistration) => {
        value.name = `Endpoint #${endpointCountRef.current}`;

        // **** show the client endpoint information ****

        let updated: SingleRequestData = {
          name: value.name,
          id: 'create_endpoint',
          requestUrl: url, 
          responseData: JSON.stringify(value, null, 2),
          responseDataType: RenderDataAsTypes.FHIR,
          info: 'Endpoint Created:\n' +
            `\tName: ${value.name}\n` +
            `\tUID: ${value.uid}\n` +
            `\tURL: ${props.paneProps.clientHostInfo.url}Endpoints/${value.uid}/\n` +
            '',
          };

        let updatedData: SingleRequestData[] = props.data.slice();
        updatedData.push(updated);
        props.setData(updatedData);

        // **** register this endpoint (updates status) ****

        props.registerEndpoint(value);

        // **** increment our endpoint counter ****

        endpointCountRef.current = endpointCountRef.current + 1;
      })
      .catch((reason: any) => {
        
        // **** show the client endpoint information ****

        let updated: SingleRequestData = {
          name: 'Create Endpoint',
          id: 'create_endpoint',
          requestUrl: url, 
          responseData: `Request for endpoint (${url}) failed:\n${reason}`,
          responseDataType: RenderDataAsTypes.Error
          };

        props.setData([updated]);
        props.updateStatus({...props.status, busy: false});
      });
  };

  /** Return this component */
  return(
    <DataCard
      info={info}
      data={props.data}
      paneProps={props.paneProps}
      status={props.status}
      >
      <Button
        onClick={createEndpoint}
        >
        Create New REST Endpoint
      </Button>
    </DataCard>
  );
}