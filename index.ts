import { IDocHubCore } from './interfaces/core';

export * from './interfaces/contexts';
export * from './interfaces/protocols';
export * from './interfaces/core';
export * from './interfaces/documents';
export * from './interfaces/protocols';
export * from './interfaces/uicomponents';
export * from './interfaces/editors';
export * from './interfaces/datalake';
export * from './interfaces/constructors';
export * from './interfaces/providers';
export * from './interfaces/objects';
export * from './interfaces/ui';
export * from './interfaces/localstorage';
export * from './interfaces/eventbus';
export * from './interfaces/router';
export * from './interfaces/settings';
export * from './interfaces/problems';
export * from './interfaces/collabarations';
export * from './schemas/basetypes';
export * from './schemas/dochub-yaml';


export const DocHub: IDocHubCore = window['DocHub'];
export const Vue2 = () => window['Vue'];
export const Vuetify2 = () => window['Vuetify'];

if (!DocHub) throw new Error('!!!!!!!! No found DocHub core! !!!!!!!!!');
