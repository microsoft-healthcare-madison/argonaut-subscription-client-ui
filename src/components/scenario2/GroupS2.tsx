import React, {useState} from 'react';

import {
  Tabs, Tab, TabId,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import PatientCreateCard from '../common/PatientCreateCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import GroupSearchCard from '../common/GroupSearchCard';
import GroupCreateCard from '../common/GroupCreateCard';

export interface GroupS2Props {
  paneProps: ContentPaneProps,
  registerSelectedGroupId: ((groupId: string, patientIds: string[]) => void),
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
}

/** Component representing the Scenario 2 Group Card */
export default function GroupS2(props: GroupS2Props) {

  const info: DataCardInfo = {
    id: 's2_group',
    stepNumber: 2,
    heading: (props.paneProps.fhirServerInfo.supportsCreateGroup) ? 'Select or Create a Group' : 'Select a Group',
    description: '',
    optional: false,
  };

  const [selectedTabId, setSelectedTabId] = useState<string>('s2_search');

  /** Function to handle tab selection changes */
  function handleTabChange(navbarTabId: TabId) {
    setSelectedTabId(navbarTabId.toString());
  }

  /** Update data to show selected patient and notify parent */
  function handleSelectGroup(groupId: string, patientIds: string[]) {

    // **** add to our data ****
    if ((props.data) && (props.data.length > 0)) {
      let updated: SingleRequestData = {...props.data[0], info: `Using group id: ${groupId}`};
      props.setData([updated]);
    } else {
      let updated: SingleRequestData = {
        name: 'Group',
        id: 'group',
        info: `Using group id: ${groupId}`,
      }
      props.setData([updated]);
    }

    // **** register with parent ****

    props.registerSelectedGroupId(groupId, patientIds);
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
        <GroupSearchCard
          paneProps={props.paneProps}
          setData={props.setData}
          registerSelectedGroup={handleSelectGroup}
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
              <GroupSearchCard
                paneProps={props.paneProps}
                setData={props.setData}
                registerSelectedGroup={handleSelectGroup}
                />
            }
            />
          <Tab
            id='s2_create'
            title='Create'
            panel={
              <GroupCreateCard
                paneProps={props.paneProps}
                setData={props.setData}
                registerSelectedGroup={handleSelectGroup}
                />
            }
            />
        </Tabs>
    </DataCard>
  );

}