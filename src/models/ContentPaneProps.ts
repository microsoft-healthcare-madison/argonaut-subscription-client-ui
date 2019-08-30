import { ConnectionInformation } from './ConnectionInformation';
import { IconName } from '@blueprintjs/core';

export interface ContentPaneProps {
  fhirServerInfo: ConnectionInformation;
  clientHostInfo: ConnectionInformation;
  updateFhirServerInfo: ((fhirServerInfo: ConnectionInformation) => void);
  updateClientHostInfo: ((clientHostInfo: ConnectionInformation) => void);
  connectClientHostWebSocket: ((clientHostInfo: ConnectionInformation) => void);
  registerHostMessageHandler: ((handler: ((message: string) => void)) => void);
  toaster: ((message: string, iconName?: IconName, timeout?: number) => void);
  uiDark: boolean;
  toggleUiColors: ((useSetState: boolean) => void);
  codePaneDark: boolean;
  toggleCodePaneColors: ((useSetState: boolean) => void);
  copyToClipboard: ((message: string, toast?: string) => void);
}