import React, {useState} from 'react';

import {
  Tabs, Tab, TabId,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../models/ContentPaneProps';
import { DataCardInfo } from '../models/DataCardInfo';
import { SingleRequestData } from '../models/RequestData';
import DataCard from './DataCard';
import PatientSearchCard from './PatientSearchCard';
import PatientCreateCard from './PatientCreateCard';
import { DataCardStatus } from '../models/DataCardStatus';

export interface S1_PatientProps {
  paneProps: ContentPaneProps,
  registerSelectedPatientId: ((patientId: string) => void),
  status: DataCardStatus,
  updateStatus: ((step: number, status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((step: number, data: SingleRequestData[]) => void),
}

/** Component representing the Scenario 1 Patient Card */
export default function S1_Patient(props: S1_PatientProps) {

  const info: DataCardInfo = {
    id: 's1_patient',
    stepNumber: 2,
    heading: 'Select or Create a Patient',
    description: '',
    optional: false,
  };

  const [selectedTabId, setSelectedTabId] = useState<string>('s2_search');

  /** Function to handle tab selection changes */
  function handleTabChange(navbarTabId: TabId) {
    setSelectedTabId(navbarTabId.toString());
  }

  /** Update data to show selected patient and notify parent */
  function handleSelectPatient(patientId: string) {

    // **** add to our data ****
    if ((props.data) && (props.data.length > 0)) {
      let updated: SingleRequestData = {...props.data[0], info: `Using patient id: ${patientId}`};
      props.setData(info.stepNumber!, [updated]);
    } else {
      let updated: SingleRequestData = {
        name: 'Patient',
        id: 'patient',
        info: `Using patient id: ${patientId}`,
      }
      props.setData(info.stepNumber!, [updated]);
    }

    // **** register with parent ****

    props.registerSelectedPatientId(patientId);
  }

  /** Return this component */
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
                info={info}
                setData={props.setData}
                registerSelectedPatient={handleSelectPatient}
                />
            }
            />
          <Tab
            id='s2_create'
            title='Create'
            panel={
              <PatientCreateCard
                paneProps={props.paneProps}
                info={info}
                setData={props.setData}
                registerSelectedPatient={props.registerSelectedPatientId}
                />
            }
            />
				</Tabs>

    </DataCard>
  );
}