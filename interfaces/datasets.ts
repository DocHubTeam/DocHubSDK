/**
 * Идентификатор источника данных
 */
export type DocHubDataSetID =  string;
/**
 * Данные не требующие обработку
 */
export type DocHubDataSetData = object;
/**
 * JSONata запрос
 */
export type DocHubJSONataQuery =  `(${string})` | `jsonata(${string})`;
/**
 * Ссылка на JSONata файл
 */
export type DocHubJSONataFile =  `${string}.jsonata`;
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

