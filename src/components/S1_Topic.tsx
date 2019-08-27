import React, {useState} from 'react';

import {
  Button,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../models/ContentPaneProps';
import { DataCardInfo } from '../models/DataCardInfo';
import { ApiHelper } from '../util/ApiHelper';
import * as fhir from '../models/fhir_r4_selected';
import { SingleRequestData, RenderDataAsTypes } from '../models/RequestData';
import DataCard from './DataCard';

export interface S1_TopicProps {
  paneProps: ContentPaneProps,
}

/** Component representing the Scenario 1 Topic Card */
export default function S1_Topic(props: S1_TopicProps) {

  const [info, setStepInfo] = useState<DataCardInfo>({
    id: 's1_topic',
    stepNumber: 1,
    heading: 'Get Topic list from FHIR Server',
    description: '',
    optional: true,
    available: true,
    completed: false,
    busy: false,
  });

  const [data, setStepData] = useState<SingleRequestData[]>([]);

  /** Handle user requests to get a topic list */
  function handleGetTopicListClick() {
    // **** update our state to show we are busy ****

    setStepInfo({...info, busy: true});

    // **** construct the registration REST url ****

    let url: string = new URL('Topic/', props.paneProps.fhirServerInfo.url).toString();

    // **** attempt to get the list of Topics ****

    ApiHelper.apiGet<fhir.Topic[]>(url)
      .then((value: fhir.Topic[]) => {
        // **** build data for display ****

        let data: SingleRequestData[] = [
          {
            name: 'Topic Search',
            id: 'topic_search', 
            requestUrl: url,
            responseData: JSON.stringify(value, null, 2),
            responseDataType: RenderDataAsTypes.FHIR
          }
        ]

        // **** update data ****

        setStepData(data);

        // **** update our step (completed) ****

        setStepInfo({...info, busy: false, completed: true});
      })
      .catch((reason: any) => {
        // **** build data for display ****

        let data: SingleRequestData[] = [
          {
            name: 'Topic Search',
            id: 'topic_search', 
            requestUrl: url,
            responseData: `Failed to get topic list from: ${url}:\n${reason}`,
            responseDataType: RenderDataAsTypes.Error
          }
        ]

        // **** update data ****

        setStepData(data);

        // **** update our step (completed) ****

        setStepInfo({...info, busy: false, completed: false});
			})
      ;
  }

  /** Return this component */
  return(
    <DataCard
      info={info}
      data={data}
      paneProps={props.paneProps}
      >
      <Button
        disabled={!info.available}
        onClick={handleGetTopicListClick}
        >
        Go
      </Button>
    </DataCard>
  );
}