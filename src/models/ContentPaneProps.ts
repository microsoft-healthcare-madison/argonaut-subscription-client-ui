import { ConnectionInformation } from './ConnectionInformation';

export interface ContentPaneProps {
  fhirServerInfo: ConnectionInformation;
  clientHostInfo: ConnectionInformation;
  updateFhirServerInfo: ((fhirServerInfo: ConnectionInformation) => void);
  updateClientHostInfo: ((clientHostInfo: ConnectionInformation) => void);
}