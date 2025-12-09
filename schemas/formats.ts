import { DocHubJSONSchema } from "./basetypes";

/**
 * Идентификатор применяемого формата
 */
export type DocHubJSONSchemaFormat = string;

/**
 * Идентификатор подсказки
 */
export type DocHubJSONSchemaFormatSuggestId = string;

/**
 * Структура подсказки
 */
export interface DocHubJSONSchemaFormatSuggest {
    // Идентификатор
    id: DocHubJSONSchemaFormatSuggestId;
    // Значение, которое будет вставлено в структуру, при выборе подсказки
    value: any;
    // Краткое название для вывода в списке. Если поля нет, берется value
    title?: string;
    // Описание элемента подсказки
    description?: string;
}

/**
 * Метод получения следующей порции подсказок
 * @param limit     - лимит на количество подсказок
 */
export type DocHubJSONSchemaFormatSuggestFetch = (limit?: number) => Promise<DocHubJSONSchemaFormatSuggests>;

/**
 * Список подсказок.
 * Если элемент списка является функцией, это является промисом на вставку элементов списка при ее вызове
 */
export type DocHubJSONSchemaFormatSuggests = (DocHubJSONSchemaFormatSuggest | DocHubJSONSchemaFormatSuggestFetch)[];

export interface DocHubJSONSchemaFormatControllerParams {
    // Значение
    value: any;
    // Схема, которая применяется к значению
    valueSchema: DocHubJSONSchema;
    // Контекст в котором происходит валидация значения
    context?: any;
    // Схема контекста
    contextSchema?: DocHubJSONSchema;
}

/**
 * Интерфейс для кастомного формата
 */
export interface DocHubJSONSchemaFormatController {
    /**
     * Валидатор значения
     * @returns                 - true если все в порядке, иначе false
     */
    validate(params: DocHubJSONSchemaFormatControllerParams): Promise<boolean>;
    /**
     * Возвращает список простых подсказок в виде списка 
     * @param params            - параметры для выбора
     * @returns                 - список подсказок
     */
    suggests?: (params: DocHubJSONSchemaFormatControllerParams) => Promise<DocHubJSONSchemaFormatSuggests>;
    /**
     * Если метод определен, его вызов должен открыть специальный UI, 
     * который позволит пользователю осуществить корректный ввод или выбор значения
     * @param params            - параметры для выбора
     * @returns                 - значение для заполнения поля
     */
    input?: (params: DocHubJSONSchemaFormatControllerParams) => Promise<any>;
}

/**
 * Коллекция форматов 
 */
export interface DocHubJSONSchemaFormatCollection {
    [id: DocHubJSONSchemaFormat]: DocHubJSONSchemaFormatController;
}

