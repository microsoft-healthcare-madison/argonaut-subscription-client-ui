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
  setEndpoints: ((data: EndpointRegistration[]) => void),
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
          responseDataType: RenderDataAsTypes.JSON,
          info: 'Endpoint Created:\n' +
            `\tName: ${value.name}\n` +
            `\tUID: ${value.uid}\n` +
            `\tURL: ${props.paneProps.clientHostInfo.url}Endpoints/${value.uid}/\n` +
            '',
          enabled: true,
          };

        let updatedData: SingleRequestData[] = props.data.slice();
        updatedData.push(updated);
        props.setData(updatedData);

        // **** update our endpoints ****

        let values: EndpointRegistration[] = props.endpoints.slice();
        values.push(value);
        props.setEndpoints(values);

        // **** increment our endpoint counter ****

        endpointCountRef.current = endpointCountRef.current + 1;

        // **** clear our busy status ****

        props.updateStatus({...props.status, busy: false});
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

  function removeEndpoint(index: number) {
    if ((index < 0) || (index >= props.endpoints.length)) {
      return;
    }
    // **** flag busy ****

    props.updateStatus({...props.status, busy: true});

    // **** grab our endpoint ****

    let endpoint: EndpointRegistration = props.endpoints[index];

    // **** build the url for our call ***

    let url: string = new URL(
      `api/Clients/${props.paneProps.clientHostInfo.registration}/Endpoints/${endpoint.uid!}`, 
      props.paneProps.clientHostInfo.url
      ).toString();

    // **** ask for this endpoint to be created ****

    ApiHelper.apiDelete(url)
      .then(() => {
        let updatedData: SingleRequestData[] = props.data.slice();
        updatedData.splice(index, 1);
        props.setData(updatedData);

        // **** update our endpoints ****

        let values: EndpointRegistration[] = props.endpoints.slice();
        values.splice(index, 1);
        props.setEndpoints(values);

        // **** clear our busy status ****

        props.updateStatus({...props.status, busy: false});
      })
      .catch((reason: any) => {
        let updatedData: SingleRequestData[] = props.data.slice();
        updatedData.splice(index, 1);
        props.setData(updatedData);

        // **** update our endpoints ****

        let values: EndpointRegistration[] = props.endpoints.slice();
        values.splice(index, 1);
        props.setEndpoints(values);

        // **** clear our busy status ****

        props.updateStatus({...props.status, busy: false});
      });
  }

  function toggleEnabled(index: number) {
    if ((index < 0) || (index >= props.endpoints.length)) {
      return;
    }

    // **** flag busy ****

    props.updateStatus({...props.status, busy: true});

    // **** grab our endpoint ****

    let endpoint: EndpointRegistration = props.endpoints[index];
    
    // **** build the url for our call ***

    let url: string = new URL(
      `api/Clients/${props.paneProps.clientHostInfo.registration}/Endpoints/${endpoint.uid!}/` +
        `${endpoint.enabled ? 'disable' : 'enable'}`, 
      props.paneProps.clientHostInfo.url
      ).toString();

      
    // **** ask for this endpoint to be toggled ****

    ApiHelper.apiPost<EndpointRegistration>(url, '')
      .then((value: EndpointRegistration) => {
        let updatedData: SingleRequestData[] = props.data.slice();
        updatedData[index].enabled = value.enabled;
        props.setData(updatedData);


        // **** update this endpoint ****

        let values: EndpointRegistration[] = props.endpoints.slice();
        values.splice(index, 1, value);
        props.setEndpoints(values);

        // **** clear our busy status ****

        props.updateStatus({...props.status, busy: false});
      })
      .catch((reason: any) => {
        // **** log an error ****
        console.log('Could not toggle endpoint state', reason);

        // **** clear our busy status ****

        props.updateStatus({...props.status, busy: false});
      });
  }

  /** Return this component */
  return(
    <DataCard
      info={info}
      data={props.data}
      paneProps={props.paneProps}
      status={props.status}
      processRowDelete={removeEndpoint}
      processRowToggle={toggleEnabled}
      >
      <Button
        onClick={createEndpoint}
        >
        Create New REST Endpoint
      </Button>
    </DataCard>
  );
}