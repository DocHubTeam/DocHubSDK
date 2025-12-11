import { DocHubJSONSchema } from "../basetypes";

/**
 * Идентификатор применяемого подсказчика
 */
export type DocHubJSONSchemaSuggesterID = string;

/**
 * Структура подсказки
 */
export interface DocHubJSONSchemaSuggest {
    // Отображаемая подсказка
    label: string;
    // Значение, которое будет применено. Если не указано, то label
    apply?: string;
    // Детальное описание для выбора подсказки
    detail?: string;
}

/**
 * Метод получения следующей порции подсказок
 * @param limit     - лимит на количество подсказок
 */
export type DocHubJSONSchemaSuggestFetch = (limit?: number) => Promise<DocHubJSONSchemaSuggests>;

/**
 * Список подсказок.
 * Если элемент списка является функцией, это является промисом на вставку элементов списка при ее вызове
 */
export type DocHubJSONSchemaSuggests = (DocHubJSONSchemaSuggest | DocHubJSONSchemaSuggestFetch)[];

export interface DocHubJSONSchemaSuggestControllerParams {
    // Значение
    value: any;
    // Схема, которая применяется к значению
    valueSchema: DocHubJSONSchema;
    // URI ресурса, который редактируется
    uri?: string;
    // Контекст в котором происходит валидация значения
    context?: any;
    // Схема контекста
    contextSchema?: DocHubJSONSchema;
}

/**
 * Интерфейс для кастомного формата
 */
export interface DocHubJSONSchemaSuggestController {
    /**
     * Возвращает список подсказок в виде списка 
     * @param params            - параметры для выбора
     * @returns                 - список подсказок
     */
    suggests(params: DocHubJSONSchemaSuggestControllerParams): Promise<DocHubJSONSchemaSuggests>;
    /**
     * Если метод определен, его вызов должен открыть специальный UI, 
     * который позволит пользователю осуществить корректный ввод или выбор значения
     * @param params            - параметры для выбора
     * @returns                 - значение для заполнения поля
     */
    input?: (params: DocHubJSONSchemaSuggestControllerParams) => Promise<any>;
}

/**
 * Коллекция форматов 
 */
export interface DocHubJSONSchemaSuggesterCollection {
    [id: DocHubJSONSchemaSuggesterID]: DocHubJSONSchemaSuggestController;
}

