import { Message } from ':core/communicator/Message';

export interface ConfigMessage extends Message {
  type: 'config';
  event: {
    type: PopupSetupEventType | SignerConfigEventType | WalletLinkConfigEventType;
    value?: unknown;
  };
}

export enum PopupSetupEventType {
  // 1. popup to clinet, after popup gets opened
  PopupListenerAdded = 'popupListenerAdded',

  // // 2. clinet to popup
  DappOriginMessage = 'dappOriginMessage',

  // // 3. popup to client
  // PopupReadyForRequest = 'popupReadyForRequest',

  // X. at some point later....
  PopupUnload = 'popupUnload',
}

export enum SignerConfigEventType {
  SignerTypeSelected = 'signerTypeSelected',
}

export enum WalletLinkConfigEventType {
  // // 1. client to popup, to request signer selection
  // SelectConnectionType = 'selectConnectionType',

  // 2.1. popup to client, signer type is selected, such as scw, extension

  // 2.2.1 popup to client, user selected walletlink
  RequestWalletLinkUrl = 'requestWalletLinkUrl',

  // 2.2.2 client to popup, to respond with walletlink URL
  WalletLinkUrl = 'walletLinkUrl',

  // 2.2.3 client to popup, walletlink scanned, close the popup
  WalletLinkQrScanned = 'walletLinkQrScanned',
}

export type SignerType = 'scw' | 'walletlink' | 'extension';

export function isConfigMessage(msg: Message): msg is ConfigMessage {
  return msg.type === 'config' && 'event' in msg;
}
