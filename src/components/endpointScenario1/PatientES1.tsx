import React, {useEffect, useState} from 'react';

import {
  Tabs, Tab, TabId,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import PatientSearchCard from '../common/PatientSearchCard';
import PatientCreateCard from '../common/PatientCreateCard';
import { DataCardStatus } from '../../models/DataCardStatus';

export interface PatientES1Props {
  paneProps: ContentPaneProps,
  selectedPatientId: string,
  registerSelectedPatientId: ((patientId: string) => void),
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
}

/** Component representing the Scenario 1 Patient Card */
export default function PatientES1(props: PatientES1Props) {

  useEffect(() => {
    if ((props.selectedPatientId !== undefined) && (props.selectedPatientId !== '')) {
      // add to our data
      if ((props.data) && (props.data.length > 0)) {
        let updated: SingleRequestData = {...props.data[0], info: `Using patient id: ${props.selectedPatientId}`};
        props.setData([updated]);
      } else {
        let updated: SingleRequestData = {
          name: 'Patient',
          id: 'patient',
          info: `Using patient id: ${props.selectedPatientId}`,
        }
        props.setData([updated]);
      }
    }
  }, [props.setData, props.selectedPatientId]);

  let supported:boolean|undefined = props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.supportsCreatePatient : props.paneProps.fhirServerInfoR5.supportsCreatePatient;

  const info: DataCardInfo = {
    id: 's1_patient',
    stepNumber: 2,
    heading: supported ? 'Select or Create a Patient' : 'Select a Patient',
    description: '',
    optional: false,
  };

  const [selectedTabId, setSelectedTabId] = useState<string>('s2_search');

  /** Function to handle tab selection changes */
  function handleTabChange(navbarTabId: TabId) {
    setSelectedTabId(navbarTabId.toString());
  }

  // check for NOT supporting create
  if (!supported) {
    // return only search
    return(
      <DataCard
        info={info}
        data={props.data}
        paneProps={props.paneProps}
        status={props.status}
        >
        <PatientSearchCard
          paneProps={props.paneProps}
          setData={props.setData}
          registerSelectedPatient={props.registerSelectedPatientId}
          />
      </DataCard>
    );
  }

  // return card with search and create options
  return(
    <DataCard
      info={info}
      data={props.data}
      paneProps={props.paneProps}
      status={props.status}
      >
      <Tabs
          animate={true}
          id='tabsStep2'
          vertical={false}
          selectedTabId={selectedTabId}
          onChange={handleTabChange}
          >
          <Tab 
            id='s2_search' 
            title='Search' 
            panel={
              <PatientSearchCard
                paneProps={props.paneProps}
                setData={props.setData}
                registerSelectedPatient={props.registerSelectedPatientId}
                />
            }
            />
          <Tab
            id='s2_create'
            title='Create'
            panel={
              <PatientCreateCard
                paneProps={props.paneProps}
                setData={props.setData}
                registerSelectedPatient={props.registerSelectedPatientId}
                />
            }
            />
        </Tabs>
    </DataCard>
  );

}