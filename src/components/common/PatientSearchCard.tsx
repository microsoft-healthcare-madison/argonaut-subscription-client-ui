import React, {useState} from 'react';

import {
  Button, Card, H6, ControlGroup, HTMLSelect, InputGroup, Spinner, RadioGroup, Radio,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { ApiHelper } from '../../util/ApiHelper';
import * as fhir from '../../models/fhir_r4_selected';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import { PatientSelectionInfo } from '../../models/PatientSelectionInfo';
import { DataCardInfo } from '../../models/DataCardInfo';

export interface PatientSearchProps {
  paneProps: ContentPaneProps,
  info: DataCardInfo,
  setData: ((step: number, data: SingleRequestData[]) => void),
  registerSelectedPatient: ((patientId: string) => void),
}

/** Component representing the Scenario 1 Patient Card */
export default function PatientSearchCard(props: PatientSearchProps) {

  const [matchType, setMatchType] = useState<string>('name');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [busy, setBusy] = useState<boolean>(false);
  const [patients, setPatients] = useState<PatientSelectionInfo[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  /** Process HTML events for the match type select box */
	function handleMatchTypeChange(event: React.FormEvent<HTMLSelectElement>) {
		setMatchType(event.currentTarget.value);
  }

  /** Process HTML events for the patient filter text box (update state for managed) */
  function handleSearchFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchFilter(event.target.value);
  }

  /** Handle HTML events raised by user changing radio selection */
	function handleRadioChange(event: React.FormEvent<HTMLInputElement>) {
    setSelectedPatientId(event.currentTarget.value);
	}

  /** Function to push the selected patient ID up into the parent */
  function handleSelectPatientClick() {
    props.registerSelectedPatient(selectedPatientId);
  }

  /** Function to handle user request to search a FHIR server for patients */
	function handleSearchClick() {
    // **** flag we are searching ****
    
    setBusy(true);

    // **** construct the search url ****

		var url: string = new URL('Patient/', props.paneProps.fhirServerInfo.url).toString();
		
		if (searchFilter) {
				url += `?${encodeURIComponent(matchType)}=${encodeURIComponent(searchFilter)}`;
		}

    // **** attempt to get the list of Patients ****

    ApiHelper.apiGet<fhir.Bundle>(url)
      .then((value: fhir.Bundle) => {

				// **** check for no values ****

				if ((!value) || (!value.entry) || (!value.entry)) {
          setBusy(false);
          setPatients([]);
          return;
				}

				var bundlePatients: PatientSelectionInfo[] = [];

				// **** loop over patients ****

				value.entry!.forEach(entry => {
					if (!entry.resource) return;

					let patient: fhir.Patient = entry.resource as fhir.Patient;

					if ((patient.id) && (patient.name)) {
						bundlePatients.push({
							key: patient.id!, 
							value: `${patient.name![0].family}, ${patient.name![0].given} (${patient.id!})`});
					}
        });
        
        // **** build data for display ****

        let data: SingleRequestData[] = [
          {
            name: 'Patient Search',
            id: 'patient_search', 
            requestUrl: url,
            responseData: JSON.stringify(value, null, 2),
            responseDataType: RenderDataAsTypes.FHIR,
          }
        ]

				// **** update our state ****

        setBusy(false);
        setPatients(bundlePatients);
        props.setData(props.info.stepNumber!, data);
      })
      .catch((reason: any) => {
        // **** build data for display ****

        let data: SingleRequestData[] = [
          {
            name: 'Patient Search',
            id: 'patient_search', 
            requestUrl: url,
            responseData: `Failed to get Patient list from: ${url}:\n${reason}`,
            responseDataType: RenderDataAsTypes.Error
          }
        ]

        // **** update our state ****

        setBusy(false);
        setPatients([]);
        props.setData(props.info.stepNumber!, data);
			})
      ;
	}

  /** Return this component */
  return(
    <Card style={{margin:0}}>
      <H6>Search and Select Existing Patient</H6>
      <ControlGroup>
        <HTMLSelect
          onChange={handleMatchTypeChange}
          defaultValue={matchType}
          >
          <option>family</option>
          <option>given</option>
          <option>_id</option>
          <option>name</option>
        </HTMLSelect>
        <InputGroup
          id='step02_searchFilter'
          value={searchFilter}
          onChange={handleSearchFilterChange}
          />
        <Button
          onClick={handleSearchClick}
          >
          Search
        </Button>
      </ControlGroup>
      <br />
      { (busy) &&
        <Spinner />
      }
      { (!busy) &&
        <RadioGroup
          label={`Select a patient, ${patients.length} found`}
          onChange={handleRadioChange}
          selectedValue={selectedPatientId}
          >
            { patients.map((patientInfo) => (
              <Radio
                key={`s02_p_${patientInfo.key}`} 
                label={patientInfo.value} 
                value={patientInfo.key} 
                checked={patientInfo.key === selectedPatientId}
                />
            ))}
        </RadioGroup>
      }
      { (!busy) &&
        <Button
          disabled={(selectedPatientId === '')}
          onClick={handleSelectPatientClick}
          style={{margin: 5}}
          >
          Use Selected Patient
        </Button>
      }
    </Card>

  );
}