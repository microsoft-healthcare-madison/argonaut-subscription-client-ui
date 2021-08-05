import React, {useState, useRef} from 'react';

import {
  HTMLSelect, Button, FormGroup,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { ApiHelper, ApiResponse } from '../../util/ApiHelper';
import * as fhir from '../../local_dts/fhir4';
import * as fhirCommon from '../../models/fhirCommon';

export interface EncountersPlaygroundProps {
  paneProps: ContentPaneProps,
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  patientIds: string[],
}

/** Component representing the Playground Encounter Card */
export default function EncountersPlayground(props: EncountersPlaygroundProps) {

  const lastPatientIndexRef = useRef<number>(-1);
  const [selectedPatient, setSelectedPatient] = useState<string>('_sequential');

  const info: DataCardInfo = {
    id: 'playground_encounter',
    heading: 'Post an Encounter to the FHIR Server to trigger a notification',
    description: '',
    optional: false,
  };
  
  const [encounterClass, setPayloadType] = useState<string>('VR');
  const encounterStatus: string = 'in-progress';
  
  async function sendEncounter() {
    props.updateStatus({...props.status, busy: true});

		// build the url for our call
    let url: string = new URL(
      'Encounter?_format=json',
      props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.url : props.paneProps.fhirServerInfoR5.url).toString();

    // figure out our patient reference
    let patientRef: string = '';

    switch (selectedPatient) {
      case '_sequential':
          if ((lastPatientIndexRef.current + 1) >= props.patientIds.length) {
            lastPatientIndexRef.current = 0;
          } else {
            lastPatientIndexRef.current = lastPatientIndexRef.current + 1;
          }
          patientRef = props.patientIds[lastPatientIndexRef.current];
        break;
      case '_random':
          let index: number = Math.floor(Math.random() * props.patientIds.length);
          patientRef = props.patientIds[index];
        break;
      default:
          patientRef = selectedPatient;
        break;
    }
    
		// build our encounter
		let encounter: fhir.Encounter = {
			resourceType: "Encounter",
			class: {
				system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
				code: encounterClass,
			},
			status: encounterStatus as fhirCommon.EncounterStatusCodes4,
			subject: {
				reference: patientRef,
			}
    }

    // ask for this encounter to be created    
    try {
      let response:ApiResponse<fhir.Encounter> = await ApiHelper.apiPostFhir<fhir.Encounter>(
        url,
        encounter,
        props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.authHeaderContent : props.paneProps.fhirServerInfoR5.authHeaderContent,
        props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.preferHeaderContent : props.paneProps.fhirServerInfoR5.preferHeaderContent);

      if (!response.value) {
        // show the client subscription information
        let updated: SingleRequestData = {
          name: 'Create Encounter',
          id: 'create_encounter',
          requestUrl: url, 
          requestData: JSON.stringify(encounter, null, 2),
          requestDataType: RenderDataAsTypes.FHIR,
          responseData: `Request for Encounter (${url}) failed:\n` +
            `${response.statusCode} - "${response.statusText}"\n` +
            `${response.body}`,
          responseDataType: RenderDataAsTypes.Error,
          outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
          };

        props.setData([updated]);
        props.updateStatus({...props.status, busy: false});
        return;
      }

      // show the client encounter information
      let updated: SingleRequestData = {
        name: 'Create Encounter',
        id: 'create_encounter',
        requestUrl: url, 
        requestData: JSON.stringify(encounter, null, 2),
        requestDataType: RenderDataAsTypes.FHIR,
        responseData: JSON.stringify(response.value, null, 2),
        responseDataType: RenderDataAsTypes.FHIR,
        outcome: response.outcome ? JSON.stringify(response.outcome, null, 2) : undefined,
        };

      props.setData([updated]);
      props.updateStatus({...props.status, busy: false});
    } catch (err) {
      // show the client subscription information
      let updated: SingleRequestData = {
        name: 'Create Encounter',
        id: 'create_encounter',
        requestUrl: url, 
        requestData: JSON.stringify(encounter, null, 2),
        requestDataType: RenderDataAsTypes.FHIR,
        responseData: `Request for Encounter (${url}) failed:\n${err}`,
        responseDataType: RenderDataAsTypes.Error
        };

      props.setData([updated]);
      props.updateStatus({...props.status, busy: false});
    }
  }

  /** Process HTML events for the payload type select box */
	function handleEncounterClassChange(event: React.FormEvent<HTMLSelectElement>) {
		setPayloadType(event.currentTarget.value);
  }

  function handleSelectedPatientChange(event: React.FormEvent<HTMLSelectElement>) {
		setSelectedPatient(event.currentTarget.value);
  }

  // check for NOT being allowed to create encounters
  if (((props.paneProps.useBackportToR4) && (!props.paneProps.fhirServerInfoR4.supportsCreateEncounter)) ||
      ((!props.paneProps.useBackportToR4) && (!props.paneProps.fhirServerInfoR5.supportsCreateEncounter))) {
    return (
    <DataCard
      info={info}
      data={props.data}
      paneProps={props.paneProps}
      status={props.status}
      >
      <br/>
      <p>This FHIR Server does not support the direct creation of Encounter resources.</p>
      <p>Please use the Server-provided method for creating an Encounter with a status
        of 'in-progress' to show a successful notification below.
      </p>
    </DataCard>
    );
  }
  
  // return the standard component
  return(
    <DataCard
      info={info}
      data={props.data}
      paneProps={props.paneProps}
      status={props.status}
      >
      <FormGroup
        label='Encounter Patient'
        helperText='Patient to use in this Encounter'
        labelFor='encounter-patient'
        >
        <HTMLSelect
          id='encounter-patient'
          value={selectedPatient}
          onChange={handleSelectedPatientChange}
          >
          <option value='_sequential'>Sequential Selection</option>
          <option value='_random'>Random Selection</option>
          {props.patientIds.map((value) => (
            <option value={value}>{value}</option>
            ))}
        </HTMLSelect>
      </FormGroup>
      <FormGroup
        label='Encounter class'
        helperText='Class (type) of encounter, per http://terminology.hl7.org/ValueSet/v3-ActEncounterCode'
        labelFor='encounter-class'
        >
        <HTMLSelect
          id='encounter-class'
          onChange={handleEncounterClassChange}
          value={encounterClass}
          >
          { Object.values(fhirCommon.v3_ActEncounterCode).map((value) => (
            <option key={value.code} value={value.code}>{value.display}</option>
              ))}
        </HTMLSelect>
      </FormGroup>
      <FormGroup
        label='Encounter Status'
        helperText='Status of encounter, per 	http://hl7.org/fhir/ValueSet/encounter-status'
        labelFor='encounter-status'
        >
        <HTMLSelect
          id='encounter-status'
          value={encounterStatus}
          onChange={() => {}}
          >
          <option value={encounterStatus}>In Progress</option>
        </HTMLSelect>
      </FormGroup>
      <Button
        disabled={(!props.status.available) || (props.status.busy) || (props.patientIds.length === 0)}
        onClick={sendEncounter}
        style={{margin: 5}}
        >
        Send Encounter
      </Button>
    </DataCard>
  );
}