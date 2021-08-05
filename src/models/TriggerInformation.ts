import { TriggerRequest } from "./TriggerRequest";
import * as fhir from '../local_dts/fhir4';

// export enum TriggerStatuses {
//   Unknown = 0,
//   Queued,
//   Processing,
//   Complete,
//   Error
// }

export interface TriggerInformation {
  
  uid: string;
  request: TriggerRequest;
  sentPrimaryObjects: fhir.Bundle;
  failedPrimaryObjects: fhir.Bundle;
  sentSupportingObjects: fhir.Bundle;
  failedSupportingObjects: fhir.Bundle;

  status: number;
  availabileUntil: Date;
}