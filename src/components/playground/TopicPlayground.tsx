import React from 'react';

import {
  Button,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { ApiHelper } from '../../util/ApiHelper';
import * as fhir from '../../models/fhir_r4_selected';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';

export interface TopicPlaygroundProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  setTopics: ((topics: fhir.Topic[]) => void),
}

/** Component representing the Playground Topic Card */
export default function TopicPlayground(props: TopicPlaygroundProps) {

  const info: DataCardInfo = {
    id: 'playground_topic',
    heading: 'FHIR Server - Topic interactions',
    description: '',
    optional: false,
  };

  /** Handle user requests to get a topic list */
  function handleGetTopicListClick() {
    // **** update our state to show we are busy ****

    props.updateStatus({...props.status, busy: true});

    // **** construct the registration REST url ****

    let url: string = new URL('Topic/', props.paneProps.fhirServerInfo.url).toString();

    // **** attempt to get the list of Topics ****

    ApiHelper.apiGet<fhir.Bundle>(url)
      .then((value: fhir.Bundle) => {
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

        // **** check for topics in the bundle ****

        let returnedTopics: fhir.Topic[] = [];
        if (value.entry) {
          // **** each bundle.entry.resource is a Topic ****
          value.entry!.forEach((entry) => {
            if (entry.resource) {
              returnedTopics.push(entry.resource! as fhir.Topic);
            }
          })
        }
        props.setTopics(returnedTopics);

        // **** update data ****

        props.setData(data);

        // **** update our step (completed) ****

        props.updateStatus({available: true, complete: true, busy: false});
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

        props.setData(data);
        props.setTopics([]);

        // **** update our step (failed) ****

        props.updateStatus({available: true, complete: false, busy: false});
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
        disabled={(!props.status.available) || (props.status.busy)}
        onClick={handleGetTopicListClick}
        >
        Go
      </Button>
    </DataCard>
  );
}