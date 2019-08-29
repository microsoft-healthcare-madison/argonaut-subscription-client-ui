import React, {useState, useEffect} from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { EndpointRegistration } from '../../models/EndpointRegistration';
import { ApiHelper } from '../../util/ApiHelper';

export interface S1_EndpointProps {
  paneProps: ContentPaneProps,
  registerEndpoint: ((endpoint: EndpointRegistration) => void),
  status: DataCardStatus,
  updateStatus: ((step: number, status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((step: number, data: SingleRequestData[]) => void),
}

/** Component representing the Scenario 1 Endpoint Card */
export default function S1_Endpoint(props: S1_EndpointProps) {

  const info: DataCardInfo = {
    id: 's1_endpoint',
    stepNumber: 3,
    heading: 'Ask the Client Host to create a REST Endpoint',
    description: '',
    optional: false,
  };

  let [endpointNeeded, setEndpointNeeded] = useState<boolean>(true);

  useEffect(() => {
    // **** check for available and endpoint is needed ****

    if ((props.status.available) && (endpointNeeded)) {
      setEndpointNeeded(false);
      createEndpoint();
    }

    if ((!props.status.available) && (!endpointNeeded)) {
      setEndpointNeeded(true);
    }
  }, [endpointNeeded, props.status.available]);

  function createEndpoint() {
    props.updateStatus(info.stepNumber!, {...props.status, busy: true});

		// **** build the url for our call ***

		let url: string = new URL(
			`api/Clients/${props.paneProps.clientHostInfo.registration}/Endpoints/REST/`, 
			props.paneProps.clientHostInfo.url
			).toString();

		// **** ask for this endpoint to be created ****

		ApiHelper.apiPost<EndpointRegistration>(url, '')
			.then((value: EndpointRegistration) => {
				// **** show the client endpoint information ****

        let updated: SingleRequestData = {
          name: 'Create Endpoint',
          id: 'create_endpoint',
          requestUrl: url, 
          responseData: JSON.stringify(value, null, 2),
          responseDataType: RenderDataAsTypes.FHIR,
          info: 'Endpoint Created:\n' +
            `\tUID: ${value.uid}\n` +
            `\tURL: ${props.paneProps.clientHostInfo.url}Endpoints/${value.uid}/\n` +
            '',
          };

        props.setData(info.stepNumber!, [updated]);

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

        props.setData(info.stepNumber!, [updated]);
        props.updateStatus(info.stepNumber!, {...props.status, busy: false});
			});
  }
  
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