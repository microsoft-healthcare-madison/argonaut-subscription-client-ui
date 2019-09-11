import React, {useState, useEffect} from 'react';

import {
  Button, Card, H6, HTMLSelect, InputGroup, Spinner, FormGroup,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { ApiHelper, ApiResponse } from '../../util/ApiHelper';
import * as fhir from '../../models/fhir_r4_selected';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import { DateInput } from '@blueprintjs/datetime';
import { DataCardInfo } from '../../models/DataCardInfo';

export interface PatientCreateProps {
  paneProps: ContentPaneProps,
  setData: ((data: SingleRequestData[]) => void),
  registerSelectedPatient: ((patientId: string) => void),
}

/** Component representing the Patient Create Card */
export default function PatientCreateCard(props: PatientCreateProps) {

  const [givenName, setGivenName] = useState<string>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [patientId, setPatientId] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [birthDate, setBirthDate] = useState<Date>(new Date());

  const [busy, setBusy] = useState<boolean>(false);

  useEffect(() => {
    // **** check for having data ****

    if (patientId !== '') {
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

    
		let msPerYear: number = 365.25 * 24 * 60 * 60 * 1000;
    let birthDate: Date = new Date((new Date()).valueOf() - Math.floor((Math.random() * 110) * msPerYear));
    let genderIndex: number = Math.floor(Math.random() * Object.values(fhir.PatientGenderCodes).length);

		// **** generate some info in case a new patient is created ****

		setGivenName(`Argonaut-${Math.floor((Math.random() * 10000) + 1)}`);
		setFamilyName(`Project-${Math.floor((Math.random() * 10000) + 1)}`);
		setPatientId(`${getRandomChars(3)}${Math.floor((Math.random() * 10000) + 1)}`);
    setGender(Object.values(fhir.PatientGenderCodes)[genderIndex]);
		setBirthDate(birthDate);
  },
  [patientId]
  );
  
  /** Process HTML events for the given name (update state for managed) */
  function handleGivenNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setGivenName(event.target.value);
  }

  /** Process HTML events for the family name (update state for managed) */
  function handleFamilyNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFamilyName(event.target.value);
  }
    
  /** Process HTML events for the patient id (update state for managed) */
  function handlePatientIdChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPatientId(event.target.value);
  }

  /** Process HTML events for the gender select box */
	function handleGenderChange(event: React.FormEvent<HTMLSelectElement>) {
		setGender(event.currentTarget.value);
  }

  /** Handle date selection in the patient birth date field */
  function handleBirthDateChange(selectedDate: Date, isUserChange: boolean) {
    setBirthDate(selectedDate);
  }
  
  
	/** Get a FHIR Date String from a JavaScript Date */
	function getFhirDateFromDate(date: Date) {
		return (
			date.getFullYear() +
			'-' +
			((date.getMonth() < 9) ? '0' : '') + (date.getMonth()+1) +
			'-' +
			((date.getDate() < 10) ? '0' : '') + date.getDate() 
			)
			;
  }
  
  /** Function to handle a user request to create a patient */
  async function handleCreatePatientClick() {
    // **** flag we are busy ****
    
    setBusy(true);
		
		// **** create a new patient ****

		var patient: fhir.Patient = {
			resourceType: 'Patient',
			id: patientId,
			name: [{
				family: familyName,
				given: [givenName],
				use: 'official'
			}],
			gender: gender,
			birthDate: getFhirDateFromDate(birthDate),
		}

		// **** PUT this on the server ****

		let url: string = new URL(`Patient/${patient.id!}?_format=json`, props.paneProps.fhirServerInfo.url).toString();

    try {
      let response:ApiResponse<fhir.Patient> = await ApiHelper.apiPutFhir<fhir.Patient>(
        url,
        patient,
        props.paneProps.fhirServerInfo.authHeaderContent,
        props.paneProps.fhirServerInfo.preferHeaderContent
        );
      
      if (!response.value) {
        // **** show the client error information ****

        let updated: SingleRequestData = {
          name: 'Patient Create',
          id: 'patient_create', 
          requestUrl: url, 
          requestData: JSON.stringify(patient, null, 2),
          requestDataType: RenderDataAsTypes.FHIR,
          responseData: `Request for Patient (${url}) failed:\n` +
            `${response.statusCode} - "${response.statusText}"\n` +
            `${response.body}`,
          responseDataType: RenderDataAsTypes.Error,
          };

        props.setData([updated]);
        setBusy(false);

        return;
      }

      // **** build data for display ****

      let data: SingleRequestData = {
        name: 'Patient Create',
        id: 'patient_create', 
        requestUrl: url,
        requestData: JSON.stringify(patient, null, 2),
        requestDataType: RenderDataAsTypes.FHIR,
        responseData: JSON.stringify(response.value, null, 2),
        responseDataType: RenderDataAsTypes.FHIR,
        outcome: response.outcome ? JSON.stringify(response.outcome) : undefined,
      };

      // **** update our state ****

      setBusy(false);
      props.setData([data]);

      // **** flag this patient has been selected ****

      props.registerSelectedPatient(response.value!.id!);
    } catch (err) {
      // **** build data for display ****

      let data: SingleRequestData = {
        name: 'Patient Create',
        id: 'patient_create', 
        requestUrl: url,
        requestData: JSON.stringify(patient, null, 2),
        requestDataType: RenderDataAsTypes.FHIR,
        responseData: `Failed to PUT Patient to: ${url}:\n${err}`,
        responseDataType: RenderDataAsTypes.Error
      };

      // **** update our state ****

      setBusy(false);
      props.setData([data]);
    }
  }

  /** Return this component */
  return(
    <Card>
      <H6>Create and PUT a new Patient</H6>
      <FormGroup
        label = 'Patient Given Name'
        helperText = 'Given Name for the new Patient'
        labelFor='patient-given-name'
        >
        <InputGroup
          id='patient-given-name'
          value={givenName}
          onChange={handleGivenNameChange}
          />
      </FormGroup>
      <FormGroup
        label = 'Patient Family Name'
        helperText = 'Family Name for the new Patient'
        labelFor='patient-family-name'
        >
        <InputGroup
          id='patient-family-name'
          value={familyName}
          onChange={handleFamilyNameChange}
          />
      </FormGroup>
      <FormGroup
        label='Patient ID'
        helperText='ID for the new Patient (must contain at least one letter)'
        labelFor='patient-id'
        >
        <InputGroup
          id='patient-id'
          value={patientId}
          onChange={handlePatientIdChange}
          />
      </FormGroup>
      <FormGroup
        label='Patient Gender'
        helperText='Gender for the new Patient'
        labelFor='patient-gender'
        >
        <HTMLSelect
          id='patient-gender'
          value={gender}
          onChange={handleGenderChange}
          >
          {Object.values(fhir.PatientGenderCodes).map((code, index) => (
            <option key={`opt_${index}`}>{code}</option>
          ))}
        </HTMLSelect>
      </FormGroup>
      <FormGroup
        label='Patient Birth Date'
        helperText='Birth date of this patient'
        labelFor='patient-birthdate'
        >
        <DateInput
          onChange={handleBirthDateChange}
          formatDate={date => date.toLocaleDateString()}
          parseDate={str => new Date(str)}
          value={birthDate}
          minDate={new Date(1900, 1, 1)}
          maxDate={new Date()}
          />
      </FormGroup>
      { (!busy) &&
        <Button
          disabled={(patientId === '')}
          onClick={handleCreatePatientClick}
          style={{margin: 5}}
          >
          Create Patient
        </Button>
      }
      { (busy) &&
        <Spinner />
      }

    </Card>

  );
}