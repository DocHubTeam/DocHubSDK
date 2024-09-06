import { IDocHubCore } from './interfaces/core';

export * from './interfaces/context';
export * from './interfaces/protocol';
export * from './interfaces/core';
export * from './interfaces/document';
export * from './interfaces/protocol';
export * from './interfaces/uicomponent';

export const DocHub: IDocHubCore = window['DocHub'];

if (!DocHub) throw new Error('!!!!!!!! No found DocHub core! !!!!!!!!!');
