import { IDocHubLibrariesExport, IDocHubLibraryRequires } from "../interfaces/libraries";
import { DocHubJSONSchema, IDocHubJSONSchemaAllOf, IDocHubJSONSchemaAnyOf, IDocHubJSONSchemaArray, IDocHubJSONSchemaBase, IDocHubJSONSchemaBoolean, IDocHubJSONSchemaInteger, IDocHubJSONSchemaNumber, IDocHubJSONSchemaObject, IDocHubJSONSchemaOneOf, IDocHubJSONSchemaString } from "../schemas/basetypes";

/**
 * Зависимости плагина от свойств ядра и других плагинов
 */
export interface IDocHubManifestDependencies {
    [module: string]: string;
}

export interface IDocHubPluginEnvironmentsAllOf extends IDocHubJSONSchemaBase {
    allOf: IDocHubJSONSchemaObject[]; 
}

export interface IDocHubPluginEnvironmentsAnyOf extends IDocHubJSONSchemaBase {
    anyOf: IDocHubJSONSchemaObject[]; 
}

export interface IDocHubPluginEnvironmentsOneOf extends IDocHubJSONSchemaBase {
    oneOf: IDocHubJSONSchemaObject[]; 
}

export interface IDocHubManifestProps {
    building: {
        // Момент сборки
        moment: number;
        // Версия SDK сборки
        'dochub-sdk': string;
        // Коммит
        commit: string;
        // Версия node при сборке
        node: string;
        // Версия приложения в формате xx.xx.xx
        version: string;
    }
}

export type IDocHubManifestPlugins = string[];

export interface IDocHubManifestEnvironments {
    [module: string]: string;
}

export type IDocHubPluginEnvironments = 
    | IDocHubJSONSchemaObject
    | IDocHubPluginEnvironmentsAllOf
    | IDocHubPluginEnvironmentsAnyOf
    | IDocHubPluginEnvironmentsOneOf;

/**
 * Структура манифеста плагина для DocHub
 */
export interface IDocHubPluginManifest {
    // Системное название плагина
    name: string;
    // Описание плагина
    description?: string;
    // Ключевые слова для поиска в репозитории плагинов
    keywords?: string[];
    // Автор/вендор
    author?: string;
    // Лицензия 
    license?: string;
    // Связанные ресурсы
    urls?: {
        homepage: string;
        repository: string;
        support: string;
    }
    // Свойства приложения
    app_props: IDocHubManifestProps;
    // Переменные среды исполнения
    app_environments?: IDocHubManifestEnvironments;
    // Зависимость от общих библиотек в DocHub
    DocHubDependencies?: IDocHubLibraryRequires;
    // Экспортируемые общие библиотеки в DocHub
    DocHubExport?: IDocHubLibrariesExport;
}