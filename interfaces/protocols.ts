import { AxiosResponse, AxiosRequestConfig, ResponseType, Method } from 'axios';
import { IDocHubContext } from './contexts';

export enum ProtocolOptionsResponseTypes {
    arraybuffer = 'arraybuffer',
    blob = 'blob',
    document = 'document',
    json = 'json',
    text = 'text',
    stream = 'stream'
}

/**
 * Опции получения ответа из DataLake
 */
export interface IProtocolResponseOptions {
    responseType?: ProtocolOptionsResponseTypes;
    responseEncoding?: string;
    // Версия файла в формате определяемом драйвером
    timeout?: number;
    // Версия файла в формате определяемом протоколом
    version?: string;     
}

export interface IDocHubProtocolResponse extends AxiosResponse {
    // Версия файла в формате определяемом протоколом
    version?: string;     
}

export type FDocHubProtocolResponseDecoder = (response: IDocHubProtocolResponse, options?: IProtocolResponseOptions) => Promise<IDocHubProtocolResponse>;

// Прослойка интерфейсов Axios для последующей кастомизации и поддержания совместимости
type Modify<T, R> = Omit<T, keyof R> & R;
export interface IDocHubProtocolRequestConfig extends Modify<AxiosRequestConfig, {
    decoder?: FDocHubProtocolResponseDecoder;   // Декодировщик ответа
    method?: Method | DocHubProtocolMethods     // Метод запроса
}>{};

/**
 * Тип ресурса
 */
export enum DocHubResourceType {
    file = 'file',
    folder = 'folder',
    other = 'other'
}

/**
 * Метаинформация о файле
 */
export type DocHubResourceMetaFile = {
    type: DocHubResourceType.file,
    uri: string,
    contentType?: string,
    size?: number,
    sha?: string
}

/**
 * Метаинформация о папке
 */
export type DocHubResourceMetaFolder = {
    type: DocHubResourceType.folder,
    uri: string,
    files: DocHubResourceMetaFile[] | null // Если null - статус содержания файлов не определен
}

/**
 * Метаинформация о прочих ресурсах
 */
export type DocHubResourceMetaOther = {
    type: DocHubResourceType.other,
    uri: string,
    [prop: string]: any
}

export type DocHubResourceMeta = DocHubResourceMetaFile | DocHubResourceMetaFolder | DocHubResourceMetaOther;

/**
 * Информация о версии ресурса
 */
export interface IDocHubResourceVersion {
    uid: string;                            // Идентификатор версии в формате определенном протоколом
    uri: string;                            // URI файла в этой версии
    moment: Date;                           // Дата и время версии
    author: string;                         // Автор версии
}


/**
 * Методы доступные над ресурсом
 */
export enum DocHubProtocolMethods {
    // Classic
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    PUT = 'PUT',
    PATCH = 'PATCH',
    OPTIONS = 'OPTIONS',
    // WebDAV - Расширенные методы для работы ресурсами
    SCAN = 'SCAN',          // Сканирует ресурс URI и возвращает о нем расширенную информацию в формате DocHubResourceMeta
                            // Позволяет получать список файлов в папке
    VERSIONS = 'VERSIONS'   // Возвращает доступные версии ресурса в формате IDocHubResourceVersion
};

/**
 * Интерфейс транспортного протокола
 */
export interface IDocHubProtocol {
    /**
     * Признак активности протокола
     * @returns          - Возвращает true если протолок активен
     */
    isActive(): boolean;
    /**
     * Метод инициализации протокола
     * @param context    - Контекст функционирования протокола
     */
    bootstrap(context: IDocHubContext);
    /**
     * Разрешает ссылки
     * @param args       - Массив прямых и/или относительных URI
     * @returns          - Результирующий URI в формате протокола
     */
    resolveURL(...args: string[]): string;
    /**
     * Выполняет запрос к ресурсу по аналогии с axios
     * @param config
     * @returns          - Результат выполнения запроса
     */
    request(config: IDocHubProtocolRequestConfig): Promise<IDocHubProtocolResponse>;
    /**
     * Возвращает список методов доступных для указанного ресурса
     * @param uri        - Идентификатор ресурса
     * @returns          - Массив доступных методов для ресурса
     */
    availableMethodsFor(uri: string): Promise<DocHubProtocolMethods[]>;
}

/**
 * Интерфейс управления транспортными протоколами ресурсов
 */
export interface IDocHubProtocols {
    /**
     * Возвращает драйвер протокола по идентификатору
     * @param protocol  - Идентификатор протокола. Например, "gitlab"
     * @returns         - Возвращает драйвер протокола
     */
    get(protocol: string): IDocHubProtocol;
    /**
     * Регистрирует драйвер протокола
     * @param protocol  - Идентификатор протокола. Например, "gitlab"
     * @param driver    - Объект драйвера протокола
     */
    register(protocol: string, driver: IDocHubProtocol);
    /**
     * Возвращает массив зарегистрированных протоколов 
     * @returns         - Массив идентификаторов протоколов
     */
    fetch(): string[];
    /**
     * Выполняет запрос идентифицируя протокол протокол по URL.
     * Берет на себя некоторую сервисную работу по подготовке запроса 
     * в протокол и обработке ошибок.
     * Рекомендуется использовать именно этот метод для запросов к ресурсам.
     * @param config    - Параметры запроса
     */
    request(config: IDocHubProtocolRequestConfig): Promise<IDocHubProtocolResponse>;
}