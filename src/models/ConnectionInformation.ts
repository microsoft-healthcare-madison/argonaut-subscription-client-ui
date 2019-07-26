
export interface ConnectionInformation {
  name: string;
  url: string;
  hint: string;
  status: string;
  showMessages: boolean;
  logMessages: boolean;
  registration: string;
  // incomingMessageHandler: ((name: string, message: string) => void);
}