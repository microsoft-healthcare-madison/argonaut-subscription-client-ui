import React, {useState} from 'react';

import {
  Button, Card, H6, ControlGroup, HTMLSelect, InputGroup, Spinner, RadioGroup, Radio,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { ApiHelper, ApiResponse } from '../../util/ApiHelper';
import * as fhir from '../../local_dts/fhir4';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import { KeySelectionInfo } from '../../models/KeySelectionInfo';

export interface PatientSearchProps {
  paneProps: ContentPaneProps,
  setData: ((data: SingleRequestData[]) => void),
  registerSelectedPatient: ((patientId: string) => void),
}

/** Component representing the Patient Search Card */
export default function PatientSearchCard(props: PatientSearchProps) {

  const [matchType, setMatchType] = useState<string>('name');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [busy, setBusy] = useState<boolean>(false);
  const [patients, setPatients] = useState<KeySelectionInfo[]>([]);
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
	async function handleSearchClick() {
    // flag we are searching
    
    setBusy(true);

    // construct the search url
		var url: string = new URL(
      'Patient/', 
      props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.url : props.paneProps.fhirServerInfoR5.url).toString();
		
		if (searchFilter) {
				url += `?${encodeURIComponent(matchType)}=${encodeURIComponent(searchFilter)}`;
		}

    try {
      let response:ApiResponse<fhir.Bundle> = await ApiHelper.apiGetFhir<fhir.Bundle>(
        url,
        props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.authHeaderContent : props.paneProps.fhirServerInfoR5.authHeaderContent);

      // check for no values
      if ((!response.value) || (!response.value.entry) || (!response.value.entry)) {
        let data: SingleRequestData[] = [
          {
            name: 'Patient Search',
            id: 'patient_search', 
            requestUrl: url,
            responseData: response.body,
            responseDataType: RenderDataAsTypes.Text,
          }
        ]

        setBusy(false);
        setPatients([]);
        props.setData(data);
        return;
      }

      var bundlePatients: KeySelectionInfo[] = [];

      // loop over patients
      response.value.entry!.forEach(entry => {
        if (!entry.resource) return;

        let patient: fhir.Patient = entry.resource as fhir.Patient;

        if ((patient.id) && (patient.name)) {
          bundlePatients.push({
            key: patient.id!, 
            value: `${patient.name![0].family}, ${patient.name![0].given} (${patient.id!})`});
        }
      });
      
      // build data for display
      let data: SingleRequestData[] = [
        {
          name: 'Patient Search',
          id: 'patient_search', 
          requestUrl: url,
          responseData: JSON.stringify(response.value, null, 2),
          responseDataType: RenderDataAsTypes.FHIR,
          outcome: response.outcome ? JSON.stringify(response.outcome) : undefined,
        }
      ]

      // update our state
      setBusy(false);
      setPatients(bundlePatients);
      props.setData(data);
      
    } catch (err) {
      // build data for display
      let data: SingleRequestData[] = [
        {
          name: 'Patient Search',
          id: 'patient_search', 
          requestUrl: url,
          responseData: `Failed to get Patient list from: ${url}:\n${err}`,
          responseDataType: RenderDataAsTypes.Error
        }
      ]

      // update our state
      setBusy(false);
      setPatients([]);
      props.setData(data);
    }

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