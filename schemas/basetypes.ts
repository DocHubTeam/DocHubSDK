/**
 * Базовая схема для всех типов
 */
export interface IDocHubJSONSchemaBase {
    title?: string;             // Название
    description?: string;       // Описание
    default?: any;              // Значение по умолчанию
    examples?: any[];           // Примеры использования
    [customFile: string]: any;  // Пользовательские поля
}

/**
 * Базовые типы
 */
export enum DocHubJSONSchemaBasicTypes {
    boolean     = 'boolean',
    null        = 'null',
    string      = 'string',
    number      = 'number',
    integer     = 'integer',
    array       = 'array',
    object      = 'object'
}

export interface IDocHubJSONSchemaArray extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.array;
    items: DocHubJSONSchema;
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
}

export interface IDocHubJSONSchemaBoolean extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.boolean;
}

export interface IDocHubJSONSchemaNull extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.null;
}

export enum DocHubJSONSchemaStringFormat {
    date        = 'date',
    datetime    = 'date-time',
    enum        = 'enum',
    string      = 'string',
    label       = 'label',
    textarea    = 'textarea',
    alert       = 'alert'
}

export interface IDocHubJSONSchemaString extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.string;
    minLength?: number;
    maxLength?: number;
    enum?: string[];
    format?: DocHubJSONSchemaStringFormat;
    pattern?: string;
}

export interface IDocHubJSONSchemaNumber extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.number;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
    multipleOf?: any;
}

export interface IDocHubJSONSchemaInteger extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.integer;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
    multipleOf?: any;
}

export interface IDocHubJSONSchemaObjectProperties {
    [key: string]: DocHubJSONSchema;
}

export interface IDocHubJSONSchemaPatternProperties {
    [key: string]: DocHubJSONSchema
}

export interface IDocHubJSONSchemaObject extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.object;
    properties?: IDocHubJSONSchemaObjectProperties;
    additionalProperties?: boolean;
    required?: string[];
    minProperties?: number;
    maxProperties?: number;
    patternProperties?: IDocHubJSONSchemaPatternProperties;
    regexp?: RegExp;
    dependencies?: any;
}

export type DocHubJSONSchema = IDocHubJSONSchemaArray | IDocHubJSONSchemaString | IDocHubJSONSchemaNumber | IDocHubJSONSchemaInteger | IDocHubJSONSchemaObject | IDocHubJSONSchemaBoolean;

