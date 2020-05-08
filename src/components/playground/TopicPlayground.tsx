import React from 'react';

import {
  Button,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { ApiHelper, ApiResponse } from '../../util/ApiHelper';
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
  setTopics: ((topics: fhir.SubscriptionTopic[]) => void),
}

/** Component representing the Playground Topic Card */
export default function TopicPlayground(props: TopicPlaygroundProps) {

  const info: DataCardInfo = {
    id: 'playground_topic',
    heading: 'FHIR Server - SubscriptionTopic interactions',
    description: '',
    optional: false,
  };

  /** Handle user requests to get a topic list */
  async function handleGetTopicListClick() {
    // **** update our state to show we are busy ****

    props.updateStatus({...props.status, busy: true});

    // **** construct the registration REST url ****

    let url: string = props.paneProps.useBackportToR4
      ? new URL('Basic?code=R5SubscriptionTopic', props.paneProps.fhirServerInfo.url).toString()
      : new URL('SubscriptionTopic', props.paneProps.fhirServerInfo.url).toString();

    // **** attempt to get the list of Topics ****

    try {
      let response:ApiResponse<fhir.Bundle> = await ApiHelper.apiGetFhir(
        url,
        props.paneProps.fhirServerInfo.authHeaderContent
      );

      if (!response.value) {
        // **** build data for display ****

        let data: SingleRequestData[] = [
          {
            name: 'SubscriptionTopic Search',
            id: 'subscriptiontopic_search', 
            requestUrl: url,
            responseData: `Request for SubscriptionTopic (${url}) failed:\n` +
              `${response.statusCode} - "${response.statusText}"\n` +
              `${response.body}`,
            responseDataType: RenderDataAsTypes.Error,
            outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
          }
        ];

        props.setData(data);
        props.updateStatus({available: true, complete: false, busy: false});
        return;
      }

      // **** traverse the bundle looking for topics ****

      let topics:fhir.SubscriptionTopic[] = [];
      let topicInfo: string = '';

      if (response.value.entry) {
        response.value.entry.forEach((entry: fhir.BundleEntry) => {
          if (!entry.resource) return;

          let topic:fhir.SubscriptionTopic = props.paneProps.useBackportToR4
            ? JSON.parse((entry.resource as fhir.Basic).extension![0].valueString!)
            : entry.resource as fhir.SubscriptionTopic;

          topics.push(topic);
          topicInfo = topicInfo + 
            `- SubscriptionTopic/${topic.id}\n` +
            `\tURL:         ${topic.url}\n` +
            `\tTitle:       ${topic.title}\n` +
            `\tDescription: ${topic.description}\n`;
        });
      }

      // **** build data for display ****

      let data: SingleRequestData[] = [
        {
          name: 'SubscriptionTopic Search',
          id: 'subscriptiontopic_search', 
          requestUrl: url,
          responseData: JSON.stringify(response.value, null, 2),
          responseDataType: RenderDataAsTypes.FHIR,
          outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
          info: topicInfo,
        }
      ];

      // **** update data ****

      props.setData(data);
      props.setTopics(topics);

      // **** update our step (completed) ****

      props.updateStatus({available: true, complete: true, busy: false});

    } catch (err) {
      // **** build data for display ****

      let data: SingleRequestData[] = [
        {
          name: 'SubscriptionTopic Search',
          id: 'subscriptiontopic_search', 
          requestUrl: url,
          responseData: `Failed to get topic list from: ${url}:\n${err}`,
          responseDataType: RenderDataAsTypes.Error
        }
      ];

      props.setData(data);
      props.updateStatus({available: true, complete: false, busy: false});
    }
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