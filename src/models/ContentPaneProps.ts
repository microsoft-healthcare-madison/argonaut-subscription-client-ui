import { ConnectionInformation } from './ConnectionInformation';
import { IconName } from '@blueprintjs/core';

export interface ContentPaneProps {
  fhirServerInfo: ConnectionInformation;
  updateFhirServerInfo: ((info: ConnectionInformation) => void);
  clientHostInfo: ConnectionInformation;
  updateClientHostInfo: ((info: ConnectionInformation) => void);
  connect: ((
    fhirServer: ConnectionInformation, 
    clientHost: ConnectionInformation,
    completionHandler: ((success: boolean) => void)
    ) => void);
  disconnect : (() => void);
  registerHostMessageHandler: ((handler: ((message: string) => void)) => void);
  toaster: ((message: string, iconName?: IconName, timeout?: number) => void);
  uiDark: boolean;
  toggleUiColors: ((useSetState: boolean) => void);
  codePaneDark: boolean;
  toggleCodePaneColors: ((useSetState: boolean) => void);
  copyToClipboard: ((message: string, toast?: string) => void);
  useBackportToR4: boolean;
  toggleUseBackportToR4: ((useSetState: boolean) => void);
  skipCapabilitiesCheck: boolean;
  toggleSkipCapabilitesCheck: ((useSetState: boolean) => void);
}