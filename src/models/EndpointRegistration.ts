
export enum EndpointChannelType {
  RestHook = 0,
  WebSocket,
  ServerSideEvent
}

export interface EndpointRegistration {
  name: string;
  uid?: string;
  channelType: EndpointChannelType;
  urlPart: string;
}