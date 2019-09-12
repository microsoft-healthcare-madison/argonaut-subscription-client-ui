import React, {useState} from 'react';

import {
  Button, Card, H6, ControlGroup, HTMLSelect, InputGroup, Spinner, RadioGroup, Radio,
} from '@blueprintjs/core';
import { ContentPaneProps } from '../../models/ContentPaneProps';
import { ApiHelper, ApiResponse } from '../../util/ApiHelper';
import * as fhir from '../../models/fhir_r4_selected';
import { SingleRequestData, RenderDataAsTypes } from '../../models/RequestData';
import { KeySelectionInfo } from '../../models/KeySelectionInfo';

export interface GroupSearchProps {
  paneProps: ContentPaneProps,
  setData: ((data: SingleRequestData[]) => void),
  registerSelectedGroup: ((groupId: string, patientIds: string[]) => void),
}

/** Component representing the Group Search Card */
export default function GroupSearchCard(props: GroupSearchProps) {

  const [matchType, setMatchType] = useState<string>('_id');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [busy, setBusy] = useState<boolean>(false);
  const [groups, setGroups] = useState<KeySelectionInfo[]>([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(-1);

  /** Process HTML events for the match type select box */
	function handleMatchTypeChange(event: React.FormEvent<HTMLSelectElement>) {
		setMatchType(event.currentTarget.value);
  }

  /** Process HTML events for the group filter text box (update state for managed) */
  function handleSearchFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchFilter(event.target.value);
  }

  /** Handle HTML events raised by user changing radio selection */
	function handleRadioChange(event: React.FormEvent<HTMLInputElement>) {
    let index:number = parseInt(event.currentTarget.value);

    if ((index >= 0) && (index < groups.length)) {
      setSelectedGroupIndex(index);
    }
	}

  /** Function to push the selected group ID up into the parent */
  function handleSelectGroupClick() {
    if ((selectedGroupIndex >= 0) && (selectedGroupIndex < groups.length)) {
      props.registerSelectedGroup(groups[selectedGroupIndex].key, groups[selectedGroupIndex].subIds!);
    }

  }

  /** Function to handle user request to search a FHIR server for groups */
	async function handleSearchClick() {
    // **** flag we are searching ****
    
    setBusy(true);

    // **** construct the search url ****

		var url: string = new URL('Group/', props.paneProps.fhirServerInfo.url).toString();
		
		if (searchFilter) {
				url += `?${encodeURIComponent(matchType)}=${encodeURIComponent(searchFilter)}&actual=true`;
		}

    try {
      let response:ApiResponse<fhir.Bundle> = await ApiHelper.apiGetFhir<fhir.Bundle>(
        url,
        props.paneProps.fhirServerInfo.authHeaderContent
      );

      // **** check for no values ****

      if ((!response.value) || (!response.value.entry) || (!response.value.entry)) {
        let data: SingleRequestData[] = [
          {
            name: 'Group Search',
            id: 'group_search', 
            requestUrl: url,
            responseData: response.body,
            responseDataType: RenderDataAsTypes.Text,
          }
        ]

        setBusy(false);
        setGroups([]);
        setSelectedGroupIndex(-1);
        props.setData(data);
        return;
      }

      var bundleGroups: KeySelectionInfo[] = [];

      // **** loop over groups ****

      response.value.entry!.forEach(entry => {
        if (!entry.resource) return;

        let group: fhir.Group = entry.resource as fhir.Group;

        // if (!group.active) return;
        if (!group.actual) return;

        let memberCount = group.quantity ? group.quantity : (group.member ? group.member!.length : 0);
        let ids: string[] = [];

        if (group.member) {
          group.member!.forEach((member: fhir.GroupMember) => {
            if ((member.entity) && (member.entity.reference)) {
              ids.push(member.entity.reference);
            }
          })
        }

        if ((group.id) && (group.name)) {
          bundleGroups.push({
            key: group.id!, 
            value: `Group/${group.id} - ${group.name}: ${memberCount} ${group.type} members`,
            subIds: ids,
          });
        }
      });
      
      // **** build data for display ****

      let data: SingleRequestData[] = [
        {
          name: 'Group Search',
          id: 'group_search', 
          requestUrl: url,
          responseData: JSON.stringify(response.value, null, 2),
          responseDataType: RenderDataAsTypes.FHIR,
          outcome: response.outcome ? JSON.stringify(response.outcome) : undefined,
        }
      ]

      // **** update our state ****

      setBusy(false);
      setGroups(bundleGroups);
      setSelectedGroupIndex(-1);
      props.setData(data);
      
    } catch (err) {
      // **** build data for display ****

      let data: SingleRequestData[] = [
        {
          name: 'Group Search',
          id: 'group_search', 
          requestUrl: url,
          responseData: `Failed to get Group list from: ${url}:\n${err}`,
          responseDataType: RenderDataAsTypes.Error
        }
      ]

      // **** update our state ****

      setBusy(false);
      setGroups([]);
      setSelectedGroupIndex(-1);
      props.setData(data);
    }

	}

  /** Return this component */
  return(
    <Card style={{margin:0}}>
      <H6>Search and Select Existing Group</H6>
      <ControlGroup>
        <HTMLSelect
          onChange={handleMatchTypeChange}
          defaultValue={matchType}
          >
          <option>_id</option>
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
          label={`Select a Group, ${groups.length} found`}
          onChange={handleRadioChange}
          selectedValue={selectedGroupIndex}
          >
            { groups.map((groupInfo, index) => (
              <Radio
                key={`s02_g_${groupInfo.key}`} 
                label={groupInfo.value} 
                value={index} 
                checked={index === selectedGroupIndex}
                />
            ))}
        </RadioGroup>
      }
      { (!busy) &&
        <Button
          disabled={(selectedGroupIndex < 0)}
          onClick={handleSelectGroupClick}
          style={{margin: 5}}
          >
          Use Selected Group
        </Button>
      }
    </Card>

  );
}