
export enum EndpointChannelType {
  RestHook = 0,
  WebSocket,
  ServerSideEvent
}

export interface EndpointRegistration {
  uid?: string;
  channelType: EndpointChannelType;
  urlPart: string;
}