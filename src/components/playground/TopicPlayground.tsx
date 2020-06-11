import React from 'react';

import {
  Button,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import * as fhir from '../../models/fhir_r5';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { TopicHelper, TopicReturn } from '../../util/TopicHelper';

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
    // update our state to show we are busy
    props.updateStatus({...props.status, busy: true});

    let topicReturn:TopicReturn = await TopicHelper.GetTopics(
      props.paneProps.useBackportToR4,
      props.paneProps.fhirServerInfo
    );

    if (topicReturn.success) {
      // find the 'encounter-start' topic
      let topicInfo: string = '';

      topicReturn.topics!.forEach((topic) => {

        topicInfo = topicInfo + 
          `- SubscriptionTopic/${topic.id}\n` +
          `\tURL:         ${topic.url}\n` +
          `\tTitle:       ${topic.title}\n` +
          `\tDescription: ${topic.description}\n`;
      });

      topicReturn.data.info = topicInfo;

      // update data
      props.setData([topicReturn.data]);
      props.setTopics(topicReturn.topics);

      // update our step (completed)
      props.updateStatus({available: true, complete: true, busy: false});

      return;
    }

    props.setData([topicReturn.data]);
    props.updateStatus({available: true, complete: false, busy: false});
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