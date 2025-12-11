import { DocHubJSONSchema } from "./basetypes";
import {
    DocHubJSONSchemaSuggestController,
    DocHubJSONSchemaSuggesterCollection,
    DocHubJSONSchemaSuggesterID
} from "./fields/suggester";

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
     * Регистрирует кастомный подсказчик для JSONSchema
     * @param format            - Идентификатор формата
     * @param controller        - Контроллер обрабатывающий запросы к формату
     */
    registerSuggester(suggester: DocHubJSONSchemaSuggesterID, controller: DocHubJSONSchemaSuggestController);

    /**
     * Возвращает список доступных подсказчиков 
     */
    fetchSuggesters(): Promise<DocHubJSONSchemaSuggesterID[]>;
    /**
     * Возвращает контроллер подсказчика
     */
    getSuggester(suggesterId: DocHubJSONSchemaSuggesterID): Promise<DocHubJSONSchemaSuggestController>;
}
