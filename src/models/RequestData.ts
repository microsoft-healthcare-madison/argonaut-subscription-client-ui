
export enum RenderDataAsTypes {
  None,
  FHIR,
  JSON,
  Error,
}

export interface SingleRequestData {
  name: string;
  id: string;
  requestUrl?: string;
  requestDataType?: RenderDataAsTypes;
  requestData?: string;
  responseDataType?: RenderDataAsTypes;
  responseData?: string;
  info?: string;
  enabled?: boolean;
}