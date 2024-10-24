/**
 * Базовые типы схем
 */
export enum BaseTypes {
    object = 'object',
    string = 'string'
}

/**
 * Свойства объекта
 */
export interface IDocHubSchemaProperties {
    [key: string]: IDocHubSchema;
}

/**
 * JSON Schema
 */
export interface IDocHubSchema {
    title: string;
    type: BaseTypes;
    properties?: IDocHubSchemaProperties;
    patternProperties?: IDocHubSchemaProperties;
    required?: string[];
    pattern?: string;
    additionalProperties?: boolean;
}

