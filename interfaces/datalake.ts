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
    // Демонтирует файл из DataLake
    //  uri         - URI демонтируемого файла
    unmount(uri: string);
    // Требует перезагрузки файла задействованных в озере данных
    //  uriPattern  - Шаблон проверки соответствия URI файла
    //                Если undefined - перезагружает все
    reload(uriPattern?: string | string[] | RegExp);
    /**
     * Внесение изменений в DataLake
     * @param changes   - Массив изменений вносимых в DataLake
     * @param fileURI   - Целевой файл для изменений. Если он не указан, система сама его определяет
     * @returns         - Массив выполненных преобразований
     */
    pushData(changes: IDataLakeChange[], fileURI?: string): Promise<IDataLakeChange[]>;
    // Получение данных из DataLake
    //  expression  - JSONata выражение
    //  params      - коллекция параметров (необязательно)
    //  context     - контекст исполнения запроса (необязательно)
    pullData(expression: string, params?: IDocHubPullDataParams, context?: any): Promise<any>;
    // Сохраняет файла в DataLake
    //  uri         - URI файла во внутреннем формате DocHub
    //  context     - данные, которые требуется сохранить как файл
    // В результате возвращает статус выполненного запроса
    pushFile(uri: string, content: any): Promise<any>;
    // Получает файла из DataLake
    //  uri         - URI файла во внутреннем формате DocHub
    // В результате возвращает статус выполненного запроса
    pullFile(uri: string): Promise<any>;
    // Возвращает конечный URI на основании массива относительных и прямых URI
    resolveURI(...uri: string[]): string;
    /**
     * Регистрирует редактор файлов
     * @param pattern       - RegExp contentType файла. Например: ^.*\/markdown($|;.*$)
     * @param component     - VUE компонент для редактирования файла
     * @param title         - Название редактора файла
     */
    registerFileEditor(pattern: string, component: IDocHubFileEditorComponent, title?: string);
    /**
     * Возвращает массив зарегистрированных редакторов файлов 
     * @returns             - Массив зарегистрированных редакторов объектов
     */
    fetchFileEditors(): Promise<IDocHubFileEditorItem[]>;
    /**
     * Возвращает актуальный редактор для файла по contentType
     * @param contentType   - Тип контента. Например: text/markdown
     */
    getFileEditor(contentType: string): Promise<IDocHubFileEditorItem | null>;

    /**
     * Запрос на открытие файла на пользовательское редактирование. Необязательно будет выполнен.
     * Если редактор уже открыт, активирует его.
     * @param uri           - URI файла 
     * @param context       - Контекст редактирования файла. Необходим для связных редакторов и конструкторов.
     * @returns             - Компонент редактора, если открытие оказалось успешным
     */
    openFileEditor(uri: string, context?: IDocHubFileEditorContext): Promise<IDocHubFileEditorComponent>;

    /**
     * Запрос на завершение пользовательского редактирования файла. Не обязательно будет выполнен.
     * @param uri           - URI файла
     * @returns             - true, если закрытие оказалось успешным
     */
    closeFileEditor(uri: string): Promise<boolean>;

    /**
     * Регистрирует соответствие шаблона файла типу контента.
     * Зарегистрированная связь является приоритетной по отношению к возвращаемому заголовку content-type сервера.
     * @param pathPattern   - RegEx полного пути к файлу. Например: \.md$
     * @param contentType   - Тип контента, который соответствует шаблону файла. Например: text/markdown
     */
    registerFileContentType(pattern: string, contentType: string);

    /**
     * Возвращает тип контента по названию файла
     * @param file          - Полный путь к файлу. Например: README.md
     * @returns             - Тип контента. Например: text/markdown
     */
    getContentTypeForFile(file: string): string | null;
}

