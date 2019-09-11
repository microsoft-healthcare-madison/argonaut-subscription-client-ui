import React, {useState} from 'react';

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

export interface PatientS2Props {
  paneProps: ContentPaneProps,
  registerSelectedPatientId: ((patientId: string) => void),
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
}

/** Component representing the Scenario 2 Patient Card */
export default function PatientS2(props: PatientS2Props) {

  const info: DataCardInfo = {
    id: 's2_patient',
    stepNumber: 2,
    heading: (props.paneProps.fhirServerInfo.supportsCreatePatient) ? 'Select or Create a Patient' : 'Select a Patient',
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
      props.setData([updated]);
    } else {
      let updated: SingleRequestData = {
        name: 'Patient',
        id: 'patient',
        info: `Using patient id: ${patientId}`,
      }
      props.setData([updated]);
    }

    // **** register with parent ****

    props.registerSelectedPatientId(patientId);
  }

  // **** check for NOT supporting create ****

  if (!props.paneProps.fhirServerInfo.supportsCreatePatient) {
    // **** return only search ****

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
          registerSelectedPatient={handleSelectPatient}
          />
      </DataCard>
    );
  }

  // **** return card with search and create options ****

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
                setData={props.setData}
                registerSelectedPatient={props.registerSelectedPatientId}
                />
            }
            />
        </Tabs>
    </DataCard>
  );

}