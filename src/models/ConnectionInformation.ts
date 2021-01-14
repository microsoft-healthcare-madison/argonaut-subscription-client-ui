import { CapabilityStatementRestResource } from "./fhir_r4";

export interface ConnectionInformation {
  name: string;
  url: string;
  // proxyDestinationUrl?: string;
  hint: string;
  status: string;
  showMessages: boolean;
  logMessages: boolean;
  registration: string;
  // incomingMessageHandler: ((name: string, message: string) => void);
  supportsCreatePatient?: boolean;
  supportsCreateEncounter?: boolean;
  supportsCreateGroup?: boolean;
  authHeaderContent?: string;
  preferHeaderContent: string;
  capabilitiesRest?: CapabilityStatementRestResource[];
  websocketUrl: string;
}