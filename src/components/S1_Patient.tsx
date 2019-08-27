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

export interface S1_PatientProps {
  paneProps: ContentPaneProps,
  registerSelectedPatientId: ((patientId: string) => void),
}

/** Component representing the Scenario 1 Patient Card */
export default function S1_Patient(props: S1_PatientProps) {

  const [info, setInfo] = useState<DataCardInfo>({
    id: 's1_patient',
    stepNumber: 1,
    heading: 'Select or Create a Patient',
    description: '',
    optional: false,
    available: true,
    completed: false,
    busy: false,
  });

  const [selectedTabId, setSelectedTabId] = useState<string>('s2_search');
  const [data, setData] = useState<SingleRequestData[]>([]);

  /** Function to handle tab selection changes */
  function handleTabChange(navbarTabId: TabId) {
    setSelectedTabId(navbarTabId.toString());
  }

  /** Update data to show selected patient and notify parent */
  function handleSelectPatient(patientId: string) {

    // **** flag we are complete ****

    setInfo({...info, completed: true});

    // **** add to our data ****
    if ((data) && (data.length > 0)) {
      let updated: SingleRequestData = {...data[0], info: `Using patient id: ${patientId}`};
      setData([updated]);
    } else {
      let updated: SingleRequestData = {
        name: 'Patient',
        id: 'patient',
        info: `Using patient id: ${patientId}`,
      }
      setData([updated]);
    }

    // **** register with parent ****

    props.registerSelectedPatientId(patientId);
  }
  
  /** Return this component */
  return(
    <DataCard
      info={info}
      data={data}
      paneProps={props.paneProps}
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
                setData={setData}
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
                setData={setData}
                registerSelectedPatient={props.registerSelectedPatientId}
                />
            }
            />
				</Tabs>

    </DataCard>
  );
}