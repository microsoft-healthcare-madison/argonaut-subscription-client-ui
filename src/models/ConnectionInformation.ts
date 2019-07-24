
export interface ConnectionInformation {
  name: string;
  url: string;
  hint: string;
  status: string;
  showMessages: boolean;
  incomingMessageHandler: ((name: string, message: string) => void);
}