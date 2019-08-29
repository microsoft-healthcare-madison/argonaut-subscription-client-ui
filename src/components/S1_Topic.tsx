import React, {useState, useEffect} from 'react';

import {
  Button,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../models/ContentPaneProps';
import { DataCardInfo } from '../models/DataCardInfo';
import { ApiHelper } from '../util/ApiHelper';
import * as fhir from '../models/fhir_r4_selected';
import { SingleRequestData, RenderDataAsTypes } from '../models/RequestData';
import DataCard from './DataCard';
import { DataCardStatus } from '../models/DataCardStatus';

export interface S1_TopicProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  updateStatus: ((step: number, status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((step: number, data: SingleRequestData[]) => void),
}

/** Component representing the Scenario 1 Topic Card */
export default function S1_Topic(props: S1_TopicProps) {

  const info: DataCardInfo = {
    id: 's1_topic',
    stepNumber: 1,
    heading: 'Get Topic list from FHIR Server',
    description: '',
    optional: true,
  };

  /** Handle user requests to get a topic list */
  function handleGetTopicListClick() {
    // **** update our state to show we are busy ****

    props.updateStatus(info.stepNumber!, {...props.status, busy: true});

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

        props.setData(info.stepNumber!, data);

        // **** update our step (completed) ****

        props.updateStatus(info.stepNumber!, {available: true, complete: true, busy: false});
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

        props.setData(info.stepNumber!, data);

        // **** update our step (failed) ****

        props.updateStatus(info.stepNumber!, {available: true, complete: false, busy: false});
			})
      ;
  }

  /** Return this component */
  return(
    <DataCard
      info={info}
      status={props.status}
      data={props.data}
      paneProps={props.paneProps}
      >
      <Button
        disabled={!props.status.available}
        onClick={handleGetTopicListClick}
        >
        Go
      </Button>
    </DataCard>
  );
}