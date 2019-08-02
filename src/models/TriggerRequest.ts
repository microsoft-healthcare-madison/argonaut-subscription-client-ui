export interface TriggerRequest {
  
  fhirServerUrl: string;
  resourceName: string;
  filterName: string;
  filterMatchType: string;
  filterValue: string;
  repetitions?: number;
  delayMilliseconds?: number;
  ignoreErrors?: boolean;
}