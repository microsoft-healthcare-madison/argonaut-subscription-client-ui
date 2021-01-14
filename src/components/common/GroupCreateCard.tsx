import React, {useState, useEffect} from 'react';

import {
  Button, Card, H6, InputGroup, Spinner, FormGroup,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { ApiHelper, ApiResponse } from '../../util/ApiHelper';
import * as fhir from '../../models/fhir_r4';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import PatientSearchMultiCard from './PatientSearchCardMulti';

export interface GroupCreateProps {
  paneProps: ContentPaneProps,
  setData: ((data: SingleRequestData[]) => void),
  registerSelectedGroup: ((groupId: string, patientIds: string[]) => void),
}

/** Component representing the Group Create Card */
export default function GroupCreateCard(props: GroupCreateProps) {

  const [name, setName] = useState<string>('');
  const [groupId, setGroupId] = useState<string>('');
  const [patientIds, setPatientIds] = useState<string[]>([]);

  const [busy, setBusy] = useState<boolean>(false);
  
  useEffect(() => {
    // check for having data
    if (groupId !== '') {
      return;
    }
      
    function getRandomChar() {
      return(String.fromCharCode(65 + Math.floor((Math.random() * 26))));
    }

    function getRandomChars(count: number) {
      var value = '';
      while (count > 0)
      {
        value += getRandomChar();
        count--;
      }
      return (value);
    }

    // generate some info in case a new group is created
    setName(`TestGroup-${Math.floor((Math.random() * 10000) + 1)}`);
		setGroupId(`${getRandomChars(3)}${Math.floor((Math.random() * 10000) + 1)}`);
  },
    [groupId]
  );
  
  /** Process HTML events for the group name (update state for managed) */
  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  /** Process HTML events for the group id (update state for managed) */
  function handleGroupIdChange(event: React.ChangeEvent<HTMLInputElement>) {
    setGroupId(event.target.value);
  }
  
  /** Function to handle a user request to create a patient */
  async function handleCreateGroupClick() {
    // flag we are busy
    setBusy(true);
    
    let members: fhir.GroupMember[] = [];
    
    // add our patient references
    patientIds.forEach((patientId: string) => {
      members.push({
        entity: {reference: patientId}
      });
    });

		// create a new group
		var group: fhir.Group = {
			resourceType: 'Group',
			id: groupId,
      name: name,
      actual: true,
      active: true,
      type: fhir.GroupTypeCodes.PERSON,
      member: members,
    }
    
		// PUT this on the server
		let url: string = new URL(
      `Group/${group.id!}?_format=json`,
      props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.url : props.paneProps.fhirServerInfoR5.url).toString();

    try {
      let response:ApiResponse<fhir.Group> = await ApiHelper.apiPutFhir<fhir.Group>(
        url,
        group,
        props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.authHeaderContent : props.paneProps.fhirServerInfoR5.authHeaderContent,
        props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.preferHeaderContent : props.paneProps.fhirServerInfoR5.preferHeaderContent);
      
      if (!response.value) {
        // show the client error information
        let updated: SingleRequestData = {
          name: 'Group Create',
          id: 'group_create', 
          requestUrl: url, 
          requestData: JSON.stringify(group, null, 2),
          requestDataType: RenderDataAsTypes.FHIR,
          responseData: `Request for Group (${url}) failed:\n` +
            `${response.statusCode} - "${response.statusText}"\n` +
            `${response.body}`,
          responseDataType: RenderDataAsTypes.Error,
          };

        props.setData([updated]);
        setBusy(false);

        return;
      }

      // build data for display
      let data: SingleRequestData = {
        name: 'Group Create',
        id: 'group_create', 
        requestUrl: url,
        requestData: JSON.stringify(group, null, 2),
        requestDataType: RenderDataAsTypes.FHIR,
        responseData: JSON.stringify(response.value, null, 2),
        responseDataType: RenderDataAsTypes.FHIR,
        outcome: response.outcome ? JSON.stringify(response.outcome) : undefined,
      };

      // update our state
      setBusy(false);
      props.setData([data]);

      // flag this patient has been selected
      props.registerSelectedGroup(response.value!.id!, patientIds);
    } catch (err) {
      // build data for display
      let data: SingleRequestData = {
        name: 'Group Create',
        id: 'group_create', 
        requestUrl: url,
        requestData: JSON.stringify(group, null, 2),
        requestDataType: RenderDataAsTypes.FHIR,
        responseData: `Failed to PUT Group to: ${url}:\n${err}`,
        responseDataType: RenderDataAsTypes.Error
      };

      // update our state
      setBusy(false);
      props.setData([data]);
    }
  }
  
  /** Update data to show selected patient and notify parent */
  function handleSelectPatients(patientIds: string[]) {
    setPatientIds(patientIds);
  }

  /** Return this component */
  return(
    <Card>
      <H6>Create and PUT a new Group</H6>
      <FormGroup
        label = 'Group Name'
        helperText = 'Name for the new Group'
        labelFor='group-name'
        >
        <InputGroup
          id='group-name'
          value={name}
          onChange={handleNameChange}
          />
      </FormGroup>
      <FormGroup
        label = 'Group ID'
        helperText = 'ID for the new Group'
        labelFor='group-id'
        >
        <InputGroup
          id='group-id'
          value={groupId}
          onChange={handleGroupIdChange}
          />
      </FormGroup>
      <PatientSearchMultiCard
        paneProps={props.paneProps}
        setData={props.setData}
        registerSelectedPatients={handleSelectPatients}
        />
      { (!busy) &&
        <Button
          disabled={((groupId === '') || (patientIds.length === 0))}
          onClick={handleCreateGroupClick}
          style={{margin: 5}}
          >
          Create Group
        </Button>
      }
      { (busy) &&
        <Spinner />
      }

    </Card>

  );
}