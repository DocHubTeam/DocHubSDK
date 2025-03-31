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
    description: string;
    // Версия в формате xx.xx.xx
    version: string;
    // Ключевые слова для поиска в репозитории плагинов
    keywords: string[];
    // Автор/вендор
    author: string;
    // Лицензия 
    license: string;
    // Связанные ресурсы
    urls: {
        homepage: string;
        repository: string;
        support: string;
    }
    // Зависимости
    dependencies: IDocHubManifestDependencies;
    // Переменные окружения требуемые для работы плагина
    environments?: IDocHubPluginEnvironments;
}