import React from 'react';

import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { FormGroup, HTMLSelect } from '@blueprintjs/core';

export interface LanguageChoiceDevDaysProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  data: SingleRequestData[],
  language: string,
  setLanguage: ((lang: string) => void),
}

/** Component representing the DevDays language choice Card */
export default function LanguageChoiceDevDays(props: LanguageChoiceDevDaysProps) {

  const info: DataCardInfo = {
    id: 'devdays_language',
    heading: 'Choose a walkthrough language',
    stepNumber: 1,
    description: '',
    optional: false,
  };

  function handleLanguageChange(event: React.FormEvent<HTMLSelectElement>) {
    props.setLanguage(event.currentTarget.value);
  }

  /** Return this component */
  return(
    <DataCard
      info={info}
      data={props.data}
      paneProps={props.paneProps}
      status={props.status}
      >
      <FormGroup
        label='Programming Language'
        helperText='Programming language to use in this walkthrough'
        labelFor='pl'
        >
        <HTMLSelect
          id='pl'
          onChange={handleLanguageChange}
          value={props.language}
          >
          <option value=''>None</option>
          {/* <option value='cs'>C#</option> */}
          <option value='js'>JavaScript (Node)</option>
          {/* <option value='java'>Java</option> */}
        </HTMLSelect>
      </FormGroup>
    </DataCard>
  );
}