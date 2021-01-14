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

export interface TopicS1Props {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  setTopic: ((value: fhir.SubscriptionTopic) => void),
}

/** Component representing the Scenario 1 Topic Card */
export default function TopicS1(props: TopicS1Props) {

  const info: DataCardInfo = {
    id: 's1_topic',
    stepNumber: 1,
    heading: 'Get SubscriptionTopic list from FHIR Server',
    description: '',
    optional: true,
  };

  /** Handle user requests to get a topic list */
  async function handleGetTopicListClick() {
    // update our state to show we are busy
    props.updateStatus({...props.status, busy: true});

    let topicReturn:TopicReturn = await TopicHelper.GetTopics(
      props.paneProps.useBackportToR4,
      props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4 : props.paneProps.fhirServerInfoR5);

    if (topicReturn.success) {
      // find the 'encounter-start' topic
      let topicInfo: string = '';

      topicReturn.topics!.forEach((topic) => {
        let isEncounterStart:Boolean = (topic.url === 'http://argonautproject.org/encounters-ig/SubscriptionTopic/encounter-start');

        if ((!isEncounterStart) && (topic.derivedFrom) && (topic.derivedFrom.length > 0)) {
          topic.derivedFrom!.forEach((canonical) => {
            if (canonical === 'http://argonautproject.org/encounters-ig/SubscriptionTopic/encounter-start') {
              isEncounterStart = true;
            }
          })
        }

        if (isEncounterStart) {
          props.setTopic(topic);
          topicInfo = topicInfo + 
            `- Encounter-Start found!\n`+
            `\tId:          SubscriptionTopic/${topic.id}\n` +
            `\tURL:         ${topic.url}\n` +
            `\tTitle:       ${topic.title}\n` +
            `\tDescription: ${topic.description}\n`;
        }
      });

      topicReturn.data.info = topicInfo;

      // update data
      props.setData([topicReturn.data]);

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