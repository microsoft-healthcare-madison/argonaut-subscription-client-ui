import React, {useEffect} from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import { ApiHelper, ApiResponse } from '../../util/ApiHelper';

export interface EndpointS2Props {
  paneProps: ContentPaneProps,
  registerEndpoint: ((endpoint: EndpointRegistration) => void),
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
}

/** Component representing the Scenario 2 Endpoint Card */
export default function EndpointS2(props: EndpointS2Props) {

  const info: DataCardInfo = {
    id: 's2_endpoint',
    stepNumber: 3,
    heading: 'Ask the Client Host to create a REST Endpoint',
    description: '',
    optional: false,
  };

  useEffect(() => {
    /** Create an endpoint */
    async function createEndpoint() {
      props.updateStatus({...props.status, busy: true});

      // **** build the url for our call ***

      let url: string = new URL(
        `api/Clients/${props.paneProps.clientHostInfo.registration}/Endpoints/REST/`, 
        props.paneProps.clientHostInfo.url
        ).toString();

      // **** try to create the endpoint ****
      
      try {
        let response:ApiResponse<EndpointRegistration> = await ApiHelper.apiPost<EndpointRegistration>(
          url,
          undefined
        );

        if (!response.value) {
          // **** show the client endpoint information ****

          let updated: SingleRequestData = {
            name: 'Create Endpoint',
            id: 'create_endpoint',
            requestUrl: url, 
            responseData: `Request for Endpoint (${url}) failed:\n` +
            `${response.statusCode} - "${response.statusText}"\n` +
            `${response.body}`,
            responseDataType: RenderDataAsTypes.Error,
            };

          props.setData([updated]);
          props.updateStatus({...props.status, busy: false});
          return;
        }

        response.value.name = `Endpoint #${props.data.length}`;

        // **** show the client endpoint information ****

        let updated: SingleRequestData = {
          name: response.value.name,
          id: 'create_endpoint',
          requestUrl: url, 
          responseData: JSON.stringify(response.value, null, 2),
          responseDataType: RenderDataAsTypes.JSON,
          info: 'Endpoint Created:\n' +
            `\tUID: ${response.value.uid}\n` +
            `\tURL: ${props.paneProps.clientHostInfo.url}Endpoints/${response.value.uid}/\n` +
            '',
          };

        props.setData([updated]);

        // **** register this endpoint (updates status) ****

        props.registerEndpoint(response.value);

      } catch (err) {
        // **** show the client endpoint information ****

        let updated: SingleRequestData = {
          name: 'Create Endpoint',
          id: 'create_endpoint',
          requestUrl: url, 
          responseData: `Request for endpoint (${url}) failed:\n${err}`,
          responseDataType: RenderDataAsTypes.Error
          };

        props.setData([updated]);
        props.updateStatus({...props.status, busy: false});
      }
    };

    // **** check for available and endpoint is needed ****

    if ((props.status.available) && 
        (!props.status.busy) && 
        (!props.status.complete)) {
      createEndpoint();
    }
  }, [props]);

  
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