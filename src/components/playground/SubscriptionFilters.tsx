import React, {useState, useEffect} from 'react';

import {
 HTMLTable, Button, H6, Intent, Card,
} from '@blueprintjs/core';
import * as fhir from '../../local_dts/fhir5';
import { IconNames } from '@blueprintjs/icons';

export interface SubscriptionFiltersProps {
  filters: fhir.SubscriptionFilterBy[],
  removeFilter: ((index:number) => void),
  useBackportToR4: boolean,
}

/** Component representing the Subscription Filters (on the Subscription Playground Card) */
export default function SubscriptionFilters(props: SubscriptionFiltersProps) {

  function expandValue(value: string) {
    if (!value) return '';

    let values:string[] = value.split(',');
    let expanded:string = '';

    values.forEach((val:string, index: number) => {
      if (index === 0) {
        expanded = expanded + val;
        return;
      }
      expanded = expanded + ' -OR- ' + val;
    });

    return expanded;
  }
  
  if (props.filters.length === 0) {
    if (props.useBackportToR4) {
      return (<H6>No Filters Added (at least one filter is REQUIRED while using the backport).</H6>);
    }
    return (<H6>No Filters Added (will trigger on all resource CREATE/UPDATE operatons).</H6>);
  }

  return (
    <Card style={{margin:0}}>
      <H6>Current Filters (rows are joined by AND)</H6>
      <HTMLTable striped={true} interactive={true}>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Match Type</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {props.filters.map((filter: fhir.SubscriptionFilterBy, index: number) => (
            <tr key={`row_${index}`}>
              <td style={{padding: 0}}>
                <Button 
                  style={{marginLeft:5, marginRight:5, marginTop:5}}
                  icon={IconNames.DELETE}
                  minimal
                  intent={Intent.PRIMARY}
                  onClick={() => props.removeFilter(index)}
                  />
              </td>
              <td>{filter.searchParamName}</td>
              <td>{filter.searchModifier}</td>
              <td>{expandValue(filter.value)}</td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
    </Card>
  );
}