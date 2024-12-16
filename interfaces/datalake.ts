import { AxiosResponse } from 'axios';
import { IProtocolResponseOptions } from './protocols';
import { DocHubDataSetProfileSource, IDocHubDataSetProfile } from './datasets';
import { DocHubUITargetWindow } from './ui';

export enum DataLakeChange {
    update = 'update',          // Обновление данных по указанному пути  
    remove = 'remove',          // Удаляет данные по указанному пути
};

/**
 * RegExp для указания пути в DataLake в DocHub
 */
export const DataLakePathRegExp = '^(\\/[a-zA-Z0-9_$\\.]{1,}){1,}$';

/**
 * Путь к объекту в DataLake.
 * Последовательность ключей коллекций через "/".
 * Например: 
 *  docs/example
 *  components/dochub.main
 */
export class DataLakePath extends String {
    constructor(...args:any) {
        for (const value of args) {
            if (!(new RegExp(DataLakePathRegExp)).test(value))
                throw new Error(`Incorrect DataLakePath [${value}] The string must be in the following format ${DataLakePathRegExp}`);
        }
        super(...args);
        return this;
    }
}

// Паттерн изменившихся файлов в DataLake 
export type DocHubDataLakeChangeItem = RegExp;

//Массив изменений в DataLake передающийся с событием DataLakeEvents.onChanged
export type DocHubDataLakeChanges = DocHubDataLakeChangeItem[];

// События DataLake
export enum DataLakeEvents {
    reloadingStart = 'datalake.reloading.start',            // Начало обновления 
    reloadingFinish = 'datalake.reloading.finish',          // Завершение обновления
    onChanged = 'datalake.reloading.onChange',              // В DataLake произошли изменения
    
    mountedManifest = 'datalake.manifest.mounted',          // Смонтирован манифест в DataLake
    unmountedManifest = 'datalake.manifest.unmounted',      // Манифест отключен от DataLake
    reloadManifests = 'datalake.manifest.reloaded',         // Манифест перезагружен

    transactionBegin = 'datalake.transaction.begin',        // Транзакция на изменение DataLake открыта
    transactionCommit = 'datalake.transaction.commit',      // Транзакция на изменение успешно применена к DataLake
    transactionRollback = 'datalake.transaction.rollback',  // Транзакция на изменение отменена
}

/**
 * Запись об изменении DataLake
 */
export interface IDataLakeChange {
    // Действие над DataLake
    action: DataLakeChange;
    // Путь в DataLake куда вносятся изменения
    path: DataLakePath;
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


export interface IDocHubTransactionFileHeaders {
    [key: string]: any;
}

export enum IDocHubTransactionFileDataType {
    meta = 'meta',
    content = 'content'
}

export enum IDocHubTransactionFileAction {
    filePut = 'file-put',
    fileDelete = 'file-delete',
    fileMove = 'file-move'
}

export type IDocHubTransactionChangeFilePut = {
    action: IDocHubTransactionFileAction.filePut;
    uri: string;
    contentUID: string;
}

export type IDocHubTransactionChangeFileDelete = {
    action: IDocHubTransactionFileAction.fileDelete;
    uri: string;
}

export type IDocHubTransactionChangeFileMove = {
    action: IDocHubTransactionFileAction.fileMove;
    fromURI: string;
    toURI: string;
}

export type IDocHubTransactionChangeFile = IDocHubTransactionChangeFilePut | IDocHubTransactionChangeFileDelete | IDocHubTransactionChangeFileMove;

export interface IDocHubTransactionChangeRecord {
    uid: string;            // UUID
    moment: number;         // timestamp
    change: IDocHubTransactionChangeFile;
}

/**
 * Метаданные файла входящего в транзакцию
 */
export type IDocHubTransactionFile = {
    uid: string;                                // UUID записи
    content: string;
    headers: IDocHubTransactionFileHeaders;
}

/**
 * Транзакция на изменения DataLake
 */
export interface IDocHubTransaction {
    /**
     * Проверяет, что транзакция содержит файл
     * @param uri               - URI файла или шаблон поиска
     * @returns                 - Возвращает массив метаданных найденных файлов
     */
    getAffectedFiles(pattern: string | RegExp): Promise<string[]>;

    /**
     * Проверяет, что транзакция содержит файл
     * @param uri               - URI файла или шаблон поиска
     * @returns                 - Возвращает массив содержимое найденных файлов
     */
    getChangesForFile(pattern: string | RegExp): Promise<IDocHubTransactionChangeRecord>;

    /**
     * Удаляет запись об изменении из транзакции
     * @param uids              - массив идентификаторов изменений
     * @returns                 - Возвращает массив удаленных изменений
     */
    deleteChange(uids: string[]): Promise<IDocHubTransactionChangeRecord[]>;
}

/**
 * VUE компонент редактора файла
 */
export interface IDocHubFileEditorComponent {}


/**
 * VUE компонент редактора файлов по умолчанию
 */
export interface IDocHubFileDefaultEditorComponent extends IDocHubFileEditorComponent {}

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
    uri?: string;                           // URI файла открытого на редактирование. 
                                            // Если не определено берется из параметра openFileEditor
    contentType?: string;                   // Тип контента файла. 
                                            // Если не определено берется из данных полученных о файле в процессе открытия.
    targetWindow?: DocHubUITargetWindow;   // Где открывать указанный URI для редактирования
    [key: string]: any;                     // Произвольные ключи и значения
}

/**
 * События Datalake
 */
export enum DocHubDataLakeInitializedStatus {
    success = 'root-manifest-success',              // DataLake инициализирован
    unknown = 'root-manifest-unknown',              // Статус не определен, возможно идет загрузка платформы
    undefRootManifest = 'root-manifest-undef',      // Корневой манифест не задан
    errorRootManifest = 'root-manifest-error',      // В корневом манифесте содержатся критические ошибки не позволяющие загрузить DataLake или он отсутствует
    missingRootManifest = 'root-manifest-missing',  // Корневой манифест не обнаружен
    other = 'root-manifest-other-error'             // Возникла неопределенная ошибка не позволяющая инициализировать DataLake
}


/**
 * VUE компонент визуализатора различий файлов
 */
export interface IDocHubFileDifferComponent {}


/**
 * VUE компонент визуализатора различий файлов по умолчанию
 */
export interface IDocHubFileDefaultDifferComponent extends IDocHubFileDifferComponent {}

/**
 * Метаинформация о визуализаторе различий в файлах
 */
export interface IDocHubFileDifferItem {
    component: IDocHubFileDifferComponent;
    pattern: RegExp;
    title: string;
}

/**
 * Функция, которая должна вернуть контент версии при необходимости
 */
export type DocHubVersionContentResolver = () => Promise<AxiosResponse>;

/**
 * Интерфейс реализует доступ к заданной версии файла
 */
export interface IDocHubFileVersion {
    version: string;                        // Идентификатор версии
    uri: string;                            // URI файла версии
    moment: Date;                           // Дата и время версии
    author: string;                         // Автор версии
    pull: DocHubVersionContentResolver;     // Функция получения контента версии
}

/**
 * Тип отображения различий
 */
export enum DocHubDiffOutputFormats {
    lineByLine = 'line-by-line',
    sideBySide = 'side-by-side'
}

export interface IDocHubDiffOptions {
    title?: string;                         // Название представления
    outputFormat?: DocHubDiffOutputFormats  // Тип отображения различий
}

/**
 * Дополнительные параметры получения файла из DataLake
 */
export interface IDataLakePullFileOptions extends IProtocolResponseOptions {}

/**
 *  Обработчик событий изменения файла
 */
export type DocHubDataLakeFileFollower = () => void;

/**
 * Дополнительные параметры разрешения профиля набора данных
 */
export interface IDataSetResolveOptions {
    baseURI?: string;               // Базовый URI от которого будут разрешаться все относительные пути на файлы
    params?: IDocHubPullDataParams; // Передаваемые параметры
}



// Интерфейс доступа к DataLake
export interface IDocHubDataLake {
    /**
     * Метод определяет был ли DataLake инициализирован.
     * Возникающие при загрузке ошибки не являются причиной отсутствия инициализации.
     * DataLake считается неинициализированным, например, при отсутствии указания корневого манифеста. 
     */
    isInitialized(): Promise<DocHubDataLakeInitializedStatus>

    /**
     * Промис вызывает then когда DataLake готов к запросам
     * или вызывает catch, если immediately === true и DataLake не готов выполнить запрос.
     * @param immediately    - Если true, то функция не ожидает готовности DataLake к запросам, а генерирует ошибку
     */
    whenReady(immediately?:boolean): Promise<void>;
    
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
     * Возвращает актуальную транзакцию
     */
    getCurrentTransaction(): Promise<IDocHubTransaction>;

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
     * @param expression        - Источник данных (запрос, DataSet, файл и т.д.)
     * @param params            - Коллекция параметров (необязательно)
     * @param context           - Контекст исполнения запроса (необязательно)
     * @returns                 - Результат выполненного запроса
     */
    pullData(expression: DocHubDataSetProfileSource, params?: IDocHubPullDataParams, context?: any): Promise<any>;

    /**
     * Реализует профиль набора данных (выполняет профиль).
     * @param profile           - Профиль набора данных
     * @param options           - Параметры реализации профиля
     * @returns                 - Результат реализации профиля (результат выполненных запросов)
     */
    resolveDataSetProfile(profile: IDocHubDataSetProfile, options?: IDataSetResolveOptions): Promise<any>;
    
    /**
     * Сохраняет файла в DataLake
     * @param uri               - URI файла во внутреннем формате DocHub
     * @param content           - Содержимое файла
     * @param contentType       - Тип контента
     * @returns                 - Статус выполненного запроса
     */
    pushFile(uri: string, content: any, contentType: string): Promise<AxiosResponse>;

    /**
     * Устанавливает слежение за изменениями в файле
     * @param uri               - URI файла
     * @param handler           - Обработчик события
     */
    followFile(uri: string, handler: DocHubDataLakeFileFollower);

    /**
     * Отменяет слежение за файлом
     * @param uri               - URI файла
     * @param handler           - Обработчик события
     */
    unfollowFile(uri: string, handler: DocHubDataLakeFileFollower);

    /**
     * Загружает файл из DataLake
     * @param uri               - URI файла во внутреннем формате DocHub
     * @returns                 - Результат выполнения запроса
     */
    pullFile(uri: string, options?: IDataLakePullFileOptions): Promise<AxiosResponse>;

    /**
     * Возвращает конечный URI на основании массива относительных и прямых URI
     * @param uri               - Массив URI
     * @returns                 - Результирующий URI
     */
    resolveURI(...uri: string[]): string;

    /**
     * Возвращает URI файлов в которых определен данный путь в DataLake
     * @param path              - Путь к области DataLake через "/"
     * @returns                 - Массив URI фалов
     */
    getURIForPath(path: DataLakePath): Promise<string[]>;


    /**********************************************************************
     *                  Визуализация различий в файлах
     *********************************************************************/

    /**
     * Регистрация визуализатора различий файлов по умолчанию
     * @param component         - VUE компонент для визуализации различий
     * @param title             - Название визуализатора
     */
    registerDefaultFileDiffer(component: IDocHubFileDefaultDifferComponent, title?: string);

    /**
     * Регистрирует визуализатора различий файлов
     * @param pattern           - RegExp contentType файла. Например: ^.*\/markdown($|;.*$)
     * @param component         - VUE компонент для редактирования файла
     * @param title             - Название редактора файла
     */
    registerFileDiffer(pattern: RegExp, component: IDocHubFileDifferComponent, title?: string);

    /**
     * Возвращает массив зарегистрированных визуализаторов различий файлов по contentType
     * @returns                 - Массив зарегистрированных редакторов объектов
     */
    fetchFileDiffers(): Promise<IDocHubFileDifferItem[]>;

    /**
     * Возвращает актуальный визуализатор различий файла по contentType
     * @param contentType       - Тип контента. Например: text/markdown
     */
    getFileDiffer(contentType: string): Promise<IDocHubFileDifferItem | null>;

    /**
     * Запрос на открытие визуализатора различий на просмотр. Необязательно будет выполнен.
     * @param ver1              - Версия 1
     * @param ver2              - Версия 2
     * @param context           - Контекст редактирования файла. Необходим для связных редакторов и конструкторов.
     * @returns                 - Компонент редактора, если открытие оказалось успешным
     */
    openFileDiffer(ver1: IDocHubFileVersion, ver2: IDocHubFileVersion, options?: IDocHubDiffOptions): Promise<IDocHubFileEditorComponent>;

    /**
     * Запрос на открытие визуализатора различий на просмотр. Необязательно будет выполнен.
     * @param uri               - URI файла для которого нужно получить список версий
     * @param from              - С какой версии получать список
     * @param limit             - Количество записей в возвращаемом массиве
     * @returns                 - Список доступных версий файла
     */
    fetchFileVersions(uri: string, from?: IDocHubFileVersion, limit?: number): Promise<IDocHubFileVersion[]>;

    /**********************************************************************
     *                    Редактирование файлов
     *********************************************************************/

    /**
     * Регистрирует редактор файлов по умолчанию. 
     * Он вызывается в том случае, если не зарегистрирован частный редактор
     * @param component         - VUE компонент для редактирования файла
     * @param title             - Название редактора файла
     */
    registerDefaultFileEditor(component: IDocHubFileDefaultEditorComponent, title?: string);

    /**
     * Регистрирует редактор файлов
     * @param pattern           - RegExp contentType файла. Например: ^.*\/markdown($|;.*$)
     * @param component         - VUE компонент для редактирования файла
     * @param title             - Название редактора файла
     */
    registerFileEditor(pattern: RegExp, component: IDocHubFileEditorComponent, title?: string);

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

    /**********************************************************************
     *                    Работа с контентом файлов
     *********************************************************************/

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

