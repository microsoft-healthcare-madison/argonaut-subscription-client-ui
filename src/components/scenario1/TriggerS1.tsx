import React, {useState} from 'react';

import {
  HTMLSelect, Button, FormGroup,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { DataCardInfo } from '../../models/DataCardInfo';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import DataCard from '../basic/DataCard';
import { DataCardStatus } from '../../models/DataCardStatus';
import { ApiHelper } from '../../util/ApiHelper';
import * as fhir from '../../models/fhir_r4_selected';

export interface TriggerS1Props {
  paneProps: ContentPaneProps,
  registerEncounterSent: (() => void),
  status: DataCardStatus,
  updateStatus: ((status: DataCardStatus) => void),
  data: SingleRequestData[],
  setData: ((data: SingleRequestData[]) => void),
  selectedPatientId: string,
}

/** Component representing the Scenario 1 Trigger Card */
export default function TriggerS1(props: TriggerS1Props) {

  const info: DataCardInfo = {
    id: 's1_trigger',
    stepNumber: 6,
    heading: 'Post an Encounter to the FHIR Server to trigger a notification',
    description: '',
    optional: false,
  };
  
  const [encounterClass, setPayloadType] = useState<string>('VR');
  const encounterStatus: string = 'in-progress';
  
  function sendEncounter() {
    props.updateStatus({...props.status, busy: true});

		// **** build the url for our call ***

    let url: string = new URL('Encounter?_format=json', props.paneProps.fhirServerInfo.url).toString();

		// **** build our encounter ****

		let encounter: fhir.Encounter = {
			resourceType: "Encounter",
			class: {
				system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
				code: encounterClass,
			},
			status: encounterStatus,
			subject: {
				reference: `Patient/${props.selectedPatientId}`,
			}
		}

		// **** ask for this encounter to be created ****

		ApiHelper.apiPost<fhir.Encounter>(url, JSON.stringify(encounter))
			.then((value: fhir.Encounter) => {
				// **** show the client encounter information ****

        let updated: SingleRequestData = {
          name: 'Create Encounter',
          id: 'create_encounter',
          requestUrl: url, 
          requestData: JSON.stringify(encounter, null, 2),
          requestDataType: RenderDataAsTypes.FHIR,
          responseData: JSON.stringify(value, null, 2),
          responseDataType: RenderDataAsTypes.FHIR,
          };

        props.setData([updated]);
        props.updateStatus({...props.status, busy: false});

        props.registerEncounterSent();
			})
			.catch((reason: any) => {
        // **** show the client subscription information ****

        let updated: SingleRequestData = {
          name: 'Create Encounter',
          id: 'create_encounter',
          requestUrl: url, 
          requestData: JSON.stringify(encounter, null, 2),
          requestDataType: RenderDataAsTypes.FHIR,
          responseData: `Request for Encounter (${url}) failed:\n${reason}`,
          responseDataType: RenderDataAsTypes.Error
          };

        props.setData([updated]);
        props.updateStatus({...props.status, busy: false});
			});
  }

  /** Process HTML events for the payload type select box */
	function handleEncounterClassChange(event: React.FormEvent<HTMLSelectElement>) {
		setPayloadType(event.currentTarget.value);
  }

  // **** check for NOT being allowed to create encounters
  
  if (!props.paneProps.fhirServerInfo.supportsCreateEncounter) {
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
  
  // **** return the standard component ****
  return(
    <DataCard
      info={info}
      data={props.data}
      paneProps={props.paneProps}
      status={props.status}
      >
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
          { Object.values(fhir.v3_ActEncounterCode).map((value) => (
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
        disabled={(!props.status.available) || (props.status.busy)}
        onClick={sendEncounter}
        style={{margin: 5}}
        >
        Send Encounter
      </Button>
    </DataCard>
  );
}