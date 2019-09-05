import React, {useEffect} from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import { ApiHelper } from '../../util/ApiHelper';

export interface EndpointS1Props {
  paneProps: ContentPaneProps,
  registerEndpoint: ((endpoint: EndpointRegistration) => void),
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
}

/** Component representing the Scenario 1 Endpoint Card */
export default function EndpointS1(props: EndpointS1Props) {

  const info: DataCardInfo = {
    id: 's1_endpoint',
    stepNumber: 3,
    heading: 'Ask the Client Host to create a REST Endpoint',
    description: '',
    optional: false,
  };

  useEffect(() => {
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
          value.name = `Endpoint #${props.data.length}`;

          // **** show the client endpoint information ****

          let updated: SingleRequestData = {
            name: value.name,
            id: 'create_endpoint',
            requestUrl: url, 
            responseData: JSON.stringify(value, null, 2),
            responseDataType: RenderDataAsTypes.FHIR,
            info: 'Endpoint Created:\n' +
              `\tUID: ${value.uid}\n` +
              `\tURL: ${props.paneProps.clientHostInfo.url}` +
                `${props.paneProps.clientHostInfo.url.endsWith('/') ? '' : '/'}` +
                `Endpoints/${value.uid}/\n` +
              '',
            };

          props.setData([updated]);

          // **** register this endpoint (updates status) ****

          props.registerEndpoint(value);

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