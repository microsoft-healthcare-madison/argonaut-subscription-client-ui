import React, {useState, useRef, useEffect} from 'react';

import {
  Button, Card, H6, ControlGroup, HTMLSelect, InputGroup, Spinner, Checkbox, RadioGroup, Radio, 
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { ApiHelper, ApiResponse } from '../../util/ApiHelper';
import * as fhir from 'fhir4';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import { KeySelectionInfo } from '../../models/KeySelectionInfo';
import { ConnectionInformation } from '../../models/ConnectionInformation';

export interface ResourceSearchSingleProps {
  paneProps: ContentPaneProps,
  resourceName: string,
  setData: ((data: SingleRequestData[]) => void),
  registerSelectedId: ((id: string) => void),
}

/** Component representing a generic single-select Resource Search Card */
export default function ResourceSearchSingleCard(props: ResourceSearchSingleProps) {

  const initialLoadRef = useRef<boolean>(true);

  const [matchTypes, setMatchTypes] = useState<string[]>([]);
  const [matchType, setMatchType] = useState<string>('_id');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [busy, setBusy] = useState<boolean>(false);
  const [records, setRecords] = useState<KeySelectionInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  useEffect(() => {
    if (initialLoadRef.current) {
      // no longer first load
      initialLoadRef.current = false;

      let serverInfo:ConnectionInformation = props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4 : props.paneProps.fhirServerInfoR5;

      if (!serverInfo.capabilitiesRest)
        return;

      // look for this in the capabilities statement
      for (let index:number = 0; index < serverInfo.capabilitiesRest.length; index++) {
        if (serverInfo.capabilitiesRest[index].type === props.resourceName) {
          if (serverInfo.capabilitiesRest[index].searchParam) {
            let updated:string[] = [];
            serverInfo.capabilitiesRest[index].searchParam!.forEach((param) => {
              updated.push(param.name);
            });
            setMatchTypes(updated);
          }

          // done searching
          break;
        }
      }
    }
  }, []);

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
    setSelectedId(event.currentTarget.value);
	}

  function getString(value: any) {
    if (typeof(value) !== 'string') {
      // for now, just stringify
      return JSON.stringify(value);
    }

    return value;
  }

  /** Function to push the selected ID up into the parent */
  function handleSelectResourceClick() {
    props.registerSelectedId(selectedId);
  }
  
  /** Function to handle user request to search a FHIR server for patients */
	async function handleSearchClick() {
    // flag we are searching
    setBusy(true);

    // construct the search url
		var url: string = new URL(
      `${props.resourceName}/`, 
      props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.url : props.paneProps.fhirServerInfoR5.url).toString();
		
		if (searchFilter) {
				url += `?${encodeURIComponent(matchType)}=${encodeURIComponent(searchFilter)}`;
		}

    setHasSearched(true);

    try {
      let response:ApiResponse<fhir.Bundle> = await ApiHelper.apiGetFhir<fhir.Bundle>(
        url,
        props.paneProps.useBackportToR4 ? props.paneProps.fhirServerInfoR4.authHeaderContent : props.paneProps.fhirServerInfoR5.authHeaderContent);

      // check for no values
      if ((!response.value) || (!response.value.entry)) {
        let data: SingleRequestData[] = [
          {
            name: 'Resource Search',
            id: 'resource_search', 
            requestUrl: url,
            responseData: response.body,
            responseDataType: RenderDataAsTypes.Text,
          }
        ]

        setBusy(false);
        setRecords([]);
        props.setData(data);
        return;
      }

      var bundleRecords: KeySelectionInfo[] = [];

      // loop over results
      response.value.entry!.forEach(entry => {
        if (!entry.resource) return;
        if (!entry.resource.id) return;

        let rec: any = entry.resource;

        // attempt to make something readable
        let display:string = `${props.resourceName}/${rec.id}`;

        if (rec.name) display = display + `, Name: ${getString(rec.name)}`;
        if (rec.title) display = display + `, Title: ${getString(rec.title)}`;
        if (rec.documentation) display = display + `, Documentation: ${getString(rec.documentation)}`;
        if (rec.display) display = display + `, Display: ${getString(rec.display)}`;
        // if (rec.text) display = display + `, ${getString(rec.text)}`;

        // add this record
        bundleRecords.push({
          key: rec.id, 
          value: display,
        });
      });
      
      // build data for display
      let data: SingleRequestData[] = [
        {
          name: 'Resource Search',
          id: 'resource_search', 
          requestUrl: url,
          responseData: JSON.stringify(response.value, null, 2),
          responseDataType: RenderDataAsTypes.FHIR,
          outcome: response.outcome ? JSON.stringify(response.outcome) : undefined,
        }
      ]

      // update our state
      setBusy(false);
      setRecords(bundleRecords);
      props.setData(data);
      
    } catch (err) {
      // build data for display
      let data: SingleRequestData[] = [
        {
          name: 'Resource Search',
          id: 'resource_search', 
          requestUrl: url,
          responseData: `Failed to get Resources (${props.resourceName}) from: ${url}:\n${err}`,
          responseDataType: RenderDataAsTypes.Error
        }
      ]

      // update our state
      setBusy(false);
      setRecords([]);
      props.setData(data);
    }
	}

  /** Return this component */
  return(
    <Card style={{margin:0}}>
      <H6>Search and Select Multiple Patients</H6>
      <ControlGroup>
        <HTMLSelect
          onChange={handleMatchTypeChange}
          defaultValue={matchType}
          >
          {matchTypes.map((value, index) => (
            <option key={`opt_${index}`}>{value}</option>
          ))};
        </HTMLSelect>
        <InputGroup
          id='searchFilter'
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
      { (!busy) && (hasSearched) &&
        <RadioGroup
          label={`Select a ${props.resourceName}, ${records.length} found`}
          onChange={handleRadioChange}
          selectedValue={selectedId}
          >
          { records.map((record, index) => (
            <Radio
              key={`r_${record.key}`}
              label={record.value}
              value={record.key}
              checked={(record.key === selectedId)}
              />
            ))
          }
        </RadioGroup>
      }
      { (!busy) &&
        <Button
          disabled={(selectedId === '')}
          onClick={handleSelectResourceClick}
          style={{margin: 5}}
          >
          Use Selected {props.resourceName}
        </Button>
      }
    </Card>

  );
}