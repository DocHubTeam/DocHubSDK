/**
 * Базовая схема для всех типов
 */
export interface IDocHubJSONSchemaBase {
    title?: string;             // Название
    description?: string;       // Описание
    default?: any;              // Значение по умолчанию
    examples?: any[];           // Примеры использования
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

export interface ISchemaArray extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.array;
    items: DocHubJSONSchema;
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
}

export interface ISchemaBoolean extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.boolean;
}

export interface ISchemaNull extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.null;
}

export enum SchemaStringFormat {
    date        = 'date',
    datetime    = 'date-time',
    enum        = 'enum',
    string      = 'string',
    label       = 'label',
    textarea    = 'textarea',
    alert       = 'alert'
}

export interface ISchemaString extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.string;
    minLength?: number;
    maxLength?: number;
    enum?: string[];
    format?: SchemaStringFormat;
}

export interface ISchemaNumber extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.number;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
    multipleOf?: any;
}

export interface ISchemaInteger extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.integer;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
    multipleOf?: any;
}

export interface ISchemaObjectProperties {
    [key: string]: DocHubJSONSchema;
}

export interface ISchemaObject extends IDocHubJSONSchemaBase {
    type: DocHubJSONSchemaBasicTypes.object;
    properties: ISchemaObjectProperties;
    additionalProperties?: boolean;
    required?: string[];
    minProperties?: number;
    maxProperties?: number;
    patternProperties?: RegExp;
    regexp?: RegExp;
    dependencies?: any;
    // Порядок вывода полей сверху вниз и слева направо
    order?: string[];
}

export type DocHubJSONSchema = ISchemaArray | ISchemaString | ISchemaNumber | ISchemaInteger | ISchemaObject | ISchemaBoolean;

