import { IDocHubCore } from './interfaces/core';

export * from './interfaces/context';
export * from './interfaces/protocol';
export * from './interfaces/core';
export * from './interfaces/document';
export * from './interfaces/protocol';
export * from './interfaces/uicomponent';
export * from './interfaces/editor';
export * from './interfaces/papi';

export const DocHub: IDocHubCore = window['DocHub'];
export const Vue2: any = window['Vue'];

if (!DocHub) throw new Error('!!!!!!!! No found DocHub core! !!!!!!!!!');
