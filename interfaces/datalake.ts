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
    onChanged = 'datalake.reloading.onChange'           // В DataLake произошли изменения
}

// Хранит состояние редактора
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
 * VUE компонент редактора ресурса
 */
export interface IDocHubResourceEditorComponent {
}

/**
 * Метаинформация о редакторе ресурса
 */
export interface IDocHubResourceEditorItem {
    component: IDocHubResourceEditorComponent;
    pattern: string;
    title: string;
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
     * Монтирует произвольный ресурс в DataLake
     * @param uri   - URI монтируемого ресурса
     */
    mount(uri: string);
    // Демонтирует ресурс из DataLake
    //  uri         - URI демонтируемого ресурса
    unmount(uri: string);
    // Требует перезагрузки ресурсов задействованных в озере данных
    //  uriPattern  - Шаблон проверки соответствия URI ресурса
    //                Если undefined - перезагружает все
    reload(uriPattern?: string | string[] | RegExp);
    // Внесение изменений в DataLake
    //  changes     - Массив изменений в DataLake
    // В результате возвращает список выполненных преобразований
    pushData(changes: IDataLakeChange[]): Promise<IDataLakeChange[]>;
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
     * Регистрирует редактор ресурсов
     * @param pattern       - RegExp contentType ресурса. Например: ^.*\/markdown($|;.*$)
     * @param component     - VUE компонент для редактирования ресурса
     * @param title         - Название редактора ресурса
     */
    registerEditor(pattern: string, component: IDocHubResourceEditorItem, title?: string);
    /**
     * Возвращает массив зарегистрированных редакторов ресурсов
     * @returns             - Массив зарегистрированных редакторов объектов
     */
    fetchEditors(): Promise<IDocHubResourceEditorItem[]>;
    /**
     * Возвращает актуальный редактор для ресурса по contentType
     * @param contentType   - Тип контента. Например: text/markdown
     */
    getEditor(contentType: string): Promise<IDocHubResourceEditorItem>;

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

