import { IDocHubContext } from './contexts';
import { IDataLakeChange } from './datalake';

/**
 * Интерфейс, который должен реализовывать провайдер данных
 */
export interface IDocHubContentProvider {
    /**
     * Флаг активности провайдера
     * @returns     - возвращает true если провайдер активен
     */
    isActive(): boolean; 
    /**
     * Вызывается ядром для инициализация провайдера
     * @param context   - Контекст функционирования драйвера
     */
    bootstrap(context: IDocHubContext);
    /**
     * Конвертация контента в объекты DataLake
     * @param content   - Контент в формате обрабатываемом драйвером
     * @returns         - Объект DataLake
     */
    toObject(content: any): any;
    /**
     * Конвертация объектов в контент для хранения
     * @param data      - Объект DataLake
     * @returns         - Контент в формате обрабатываемом драйвером
     */
    toContent(data: any): any;
    /**
     * Вносит изменения из ченж-лога в контент
     * @param content   - Контент в формате обрабатываемом драйвером
     * @param changes   - Список изменений, который требуется внести в контент
     */
    mutation(content: string, changes: IDataLakeChange[]): string;
}

export interface IDocHubContentProviders {
    /**
     * Возвращает контент-провайдер по типу контента
     * @param contentType   - Тип контента
     * @returns             - Объект драйвера провайдера
     */
    get(contentType: string): IDocHubContentProvider;
    /**
     * Регистрация контент-провайдера
     * @param contentType   - Типа контента. Например, "yaml"
     * @param provider      - Объект контент-провайдера
     */
    register(contentType: string, provider: IDocHubContentProvider);
    /**
     * Возвращает массив зарегистрированных типов 
     * @returns             - Массив зарегистрированных типов контента
     */
    fetch(): string[];
}