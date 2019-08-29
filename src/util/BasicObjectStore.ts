import { IToaster } from "@blueprintjs/core";

export class BasicObjectStore {
  
  /** WebSocket object for communicating with the client host */
  static _clientHostWebSocket: WebSocket | null = null;

  /** Callback function in the active pane to handle WebSocket ClientHost notifications */
  static _paneHostMessageHandler: ((message: string) => void) | null = null;

  /** Toaster display object */
  static _toaster: IToaster|null = null;
}