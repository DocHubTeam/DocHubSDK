import { DocHubJSONSchema } from "./basetypes";
import {
    DocHubJSONSchemaFormat,
    DocHubJSONSchemaFormatCollection,
    DocHubJSONSchemaFormatController
} from "./formats";

/**
 * Схема данных DataLake
 */
export interface IDocHubDataLakeSchema {
    /**
     * Возвращает JSONSchema DataLake
     * @param path              - Путь к необходимому сегменту схемы
     */
    fetch(): Promise<DocHubJSONSchema>;

    /**
     * Регистрирует кастомный формат для валидации JSONSchema и реализации подсказок в редакторах
     * @param format            - Идентификатор формата
     * @param controller        - Контроллер обрабатывающий запросы к формату
     */
    registerSchemaFormat(format: DocHubJSONSchemaFormat, controller: DocHubJSONSchemaFormatController);

    /**
     * Возвращает коллекцию доступных форматов
     */
    fetchSchemaFormats(): Promise<DocHubJSONSchemaFormatCollection>;
}
