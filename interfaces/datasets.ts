/**
 * Идентификатор источника данных
 */
export type DocHubDataSetID =  string;
/**
 * Данные не требующие обработку
 */
export type DocHubDataSetData = object;
/**
 * JSONata запрос с расширенными свойствами
 */

/**
 * Простое, строковое определение JSONata запроса
 */
export type DocHubJSONataQuerySimple = `(${string})` | `jsonata(${string})`;

/**
 * Ссылка на JSONata файл
 */
export type DocHubJSONataFile = `${string}.jsonata`;

/**
 * Метаинформация JSONata запроса
 */
export interface DocHubJSONataQueryMeta {
    /**
     * URI ресурса, где декларирован запрос 
     */
    source?: string;
    /**
     * Путь к свойству определения
     */
    path?: string;
}

/**
 * Класс, позволяет создавать запросы с расширенной информацией об источнике его происхождения
 * для удобства отладки.
 */
export class DocHubJSONataQueryObject extends String {
    /**
     * URI ресурса, где определен запрос
     */
    private uri: string | undefined;
    /**
     * Путь к определению запроса
     */
    private path: string | undefined;
    constructor(query: DocHubJSONataQuerySimple, uri?: string, path?: string) {
        super(query);
        this.uri = uri;
        this.path = path;
        return this;
    }
    get __uri__(): string | undefined {
        return this.uri;
    }
    get __path__(): string | undefined {
        return this.path;
    }
}

/**
 * JSONata запрос
 */
export type DocHubJSONataQuery =  DocHubJSONataQuerySimple | DocHubJSONataQueryObject;

/**
 * Ссылка на файл данных
 */
export type DocHubDataFileFile = string;
/**
 * Тип поля source описывающий возможные источники данных
 */
export type DocHubDataSetProfileSource = DocHubDataSetID | DocHubJSONataQuery | DocHubJSONataFile | DocHubDataFileFile | DocHubDataSetData;
/**
 * Набор источников для поля origin
 */
export interface DocHubDataSetProfileOriginSet {
    [key: string]: DocHubDataSetProfileSource
}
/**
 * Тип поля origin для источника данных
 */
export type DocHubDataSetProfileOrigin = DocHubDataSetProfileSource | DocHubDataSetProfileOriginSet;

/**
 * Интерфейс стандартизирующий источник данных
 */
export interface IDocHubDataSetProfile {
    origin?: DocHubDataSetProfileOrigin;
    source: DocHubDataSetProfileSource;
}

