import { AxiosResponse } from "axios";

export enum DataLakeChange {
    update = 'update',          // Обновление данных по указанному пути  
    remove = 'remove',          // Удаляет данные по указанному пути
};

// Паттерн изменившихся файлов в DataLake 
export type DocHubDataLakeChangeItem = RegExp;

//Массив изменений в DataLake передающийся с событием DataLakeEvents.onChanged
export type DocHubDataLakeChanges = DocHubDataLakeChangeItem[];

// События DataLake
export enum DataLakeEvents {
    reloadingStart = 'datalake.reloading.start',        // Начало обновления 
    reloadingFinish = 'datalake.reloading.finish',      // Завершение обновления
    onChanged = 'datalake.reloading.onChange',          // В DataLake произошли изменения
    
    mountedManifest = 'datalake.manifest.mounted',      // Смонтирован манифест в DataLake
    unmountedManifest = 'datalake.manifest.unmounted',  // Манифест отключен от DataLake
    reloadManifests = 'datalake.manifest.reloaded'      // Манифест перезагружен
}

/**
 * Запись об изменении DataLake
 */
export interface IDataLakeChange {
    // Действие над DataLake
    action: DataLakeChange;
    // Путь в DataLake куда вносятся изменения
    path: string;
    // Данные, которые вносятся в DataLake
    data: object | string | number | boolean;
    // Комментарии в манифест, где изменения будут зафиксированы
    comment: string;
    // URI целевого файла для изменения
    targetFile?: string;
}

export interface IDocHubPullDataParams  {
    [key: string]: any;
}

// Контекст транзации
export interface IDocHubTransaction {

}

/**
 * VUE компонент редактора файла
 */
export interface IDocHubFileEditorComponent {}

/**
 * Метаинформация о редакторе файла
 */
export interface IDocHubFileEditorItem {
    component: IDocHubFileEditorComponent;
    pattern: RegExp;
    title: string;
}

/**
 * Описывает контекст открытого на редактирования файла
 */
export interface IDocHubFileEditorContext {
    uri?: string;           // URI файла открытого на редактирование. 
                            // Если не определено берется из параметра openFileEditor
    contentType: string;    // Тип контента файла. 
                            // Если не определено берется из данных полученных о файле в процессе открытия.
    [key: string]: any;     // Произвольные ключи и значения
}

// Интерфейс доступа к DataLake
export interface IDocHubDataLake {
    /**
     * Открывает транзакцию на изменения в DataLake
     * @returns             - Объект транзакции
     */
    beginTransaction(): Promise<IDocHubTransaction>;

    /**
     * Отправляет транзакцию в DataLake
     * @param transaction   - Объект транзакции
     */
    commitTransaction(transaction: IDocHubTransaction): Promise<IDocHubTransaction>;

    /**
     * Отменяет транзакцию
     * @param transaction   - Объект транзакции
     */
    rollbackTransaction(transaction: IDocHubTransaction): Promise<IDocHubTransaction>;

    /**
     * Возвращает URI текущего корневого манифеста
     * @returns             - URI корневого манифеста
     */
    getRootManifest(): string;

    /**
     * Монтирует произвольный файл в DataLake
     * @param uri   - URI монтируемого файла
     */
    mount(uri: string);

    /**
     * Демонтирует файл из DataLake
     * @param uri               - URI демонтируемого файла
     */
    unmount(uri: string);

    /**
     * Требует перезагрузки файлов задействованных в озере данных
     * @param uriPattern        - Шаблон проверки соответствия URI файла
     *                            Если undefined - перезагружает все  
     */
    reload(uriPattern?: string | string[] | RegExp);

    /**
     * Проверяет, что DataLake содержит файл
     * @param uri               - URI файла или шаблон поиска
     * @returns                 - Возвращает массив найденных файлов
     */
    isContainsFile(pattern: string | RegExp): Promise<string[]>;

    /**
     * Внесение изменений в DataLake
     * @param changes           - Массив изменений вносимых в DataLake
     * @returns                 - Массив выполненных преобразований
     */
    pushData(changes: IDataLakeChange[]): Promise<IDataLakeChange[]>;

    /**
     * Выполняет запрос к DataLake
     * @param expression        - JSONata выражение
     * @param params            - Коллекция параметров (необязательно)
     * @param context           - Контекст исполнения запроса (необязательно)
     * @returns                 - Результат выполненного запроса
     */
    pullData(expression: string, params?: IDocHubPullDataParams, context?: any): Promise<any>;

    /**
     * Сохраняет файла в DataLake
     * @param uri               - URI файла во внутреннем формате DocHub
     * @param content           - Содержимое файла
     * @param contentType       - Тип контента
     * @returns                 - Статус выполненного запроса
     */
    pushFile(uri: string, content: any, contentType: string): Promise<AxiosResponse>;

    /**
     * Загружает файл из DataLake
     * @param uri               - URI файла во внутреннем формате DocHub
     * @returns                 - Результат выполнения запроса
     */
    pullFile(uri: string): Promise<AxiosResponse>;

    /**
     * Возвращает конечный URI на основании массива относительных и прямых URI
     * @param uri               - Массив URI
     * @returns                 - Результирующий URI
     */
    resolveURI(...uri: string[]): string;

    /**
     * Регистрирует редактор файлов
     * @param pattern           - RegExp contentType файла. Например: ^.*\/markdown($|;.*$)
     * @param component         - VUE компонент для редактирования файла
     * @param title             - Название редактора файла
     */
    registerFileEditor(pattern: string, component: IDocHubFileEditorComponent, title?: string);

    /**
     * Возвращает массив зарегистрированных редакторов файлов 
     * @returns                 - Массив зарегистрированных редакторов объектов
     */
    fetchFileEditors(): Promise<IDocHubFileEditorItem[]>;

    /**
     * Возвращает актуальный редактор для файла по contentType
     * @param contentType       - Тип контента. Например: text/markdown
     */
    getFileEditor(contentType: string): Promise<IDocHubFileEditorItem | null>;

    /**
     * Запрос на открытие файла на пользовательское редактирование. Необязательно будет выполнен.
     * Если редактор уже открыт, активирует его.
     * @param uri               - URI файла 
     * @param context           - Контекст редактирования файла. Необходим для связных редакторов и конструкторов.
     * @returns                 - Компонент редактора, если открытие оказалось успешным
     */
    openFileEditor(uri: string, context?: IDocHubFileEditorContext): Promise<IDocHubFileEditorComponent>;

    /**
     * Запрос на завершение пользовательского редактирования файла. Не обязательно будет выполнен.
     * @param uri               - URI файла
     * @returns                 - true, если закрытие оказалось успешным
     */
    closeFileEditor(uri: string): Promise<boolean>;

    /**
     * Регистрирует соответствие шаблона файла типу контента.
     * Зарегистрированная связь является приоритетной по отношению к возвращаемому заголовку content-type сервера.
     * @param pathPattern       - RegEx полного пути к файлу. Например: \.md$
     * @param contentType       - Тип контента, который соответствует шаблону файла. Например: text/markdown
     */
    registerFileContentType(pattern: string, contentType: string);

    /**
     * Возвращает тип контента по названию файла
     * @param file              - Полный путь к файлу. Например: README.md
     * @returns                 - Тип контента. Например: text/markdown
     */
    getContentTypeForFile(file: string): string | null;
}

