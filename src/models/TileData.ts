
export enum TileDataTypes {
  None,
  FHIR,
  JSON,
  Error,
}

export interface TileData {
  name: string;
  id: string;
  requestUrl: string;
  requestDataType: TileDataTypes;
  requestData: string;
  responseDataType: TileDataTypes;
  responseData: string;
}