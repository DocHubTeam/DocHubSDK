import { IDocHubCore } from './interfaces/core';
import { dynamicProxy }  from './helpers/proxy';

export * from './interfaces/core';
export * from './interfaces/contexts';
export * from './interfaces/constructors';
export * from './interfaces/collaborations';
export * from './interfaces/datalake';
export * from './interfaces/editors';
export * from './interfaces/eventbus';
export * from './interfaces/localstorage';
export * from './interfaces/objects';
export * from './interfaces/problems';
export * from './interfaces/presentations';
export * from './interfaces/protocols';
export * from './interfaces/providers';
export * from './interfaces/router';
export * from './interfaces/settings';
export * from './interfaces/ui';
export * from './interfaces/tools';
export * from './interfaces/lang';

export * from './interfaces/datasets';

export * from './metamodel/index';

export * from './schemas/basetypes';
export * from './schemas/dochub-yaml';

export const DocHub: IDocHubCore = dynamicProxy(() => window['DocHub']);
export const Vue2 = () => window['Vue'];
export const Vuetify2 = () => window['Vuetify'];


