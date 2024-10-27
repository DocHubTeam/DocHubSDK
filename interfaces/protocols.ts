import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { IDocHubContext } from './contexts';

// Прослойка интерфейсов Axios для последующей кастомизации и поддержания совместимости
export interface IDocHubProtocolRequestConfig extends AxiosRequestConfig {
    decoder?: Function;  // Декодировщик ответа
};

export interface IDocHubProtocolResponse extends AxiosResponse {};

/**
 * Предопределенные типы контентов
 */
export enum DocHubContentType {
    folder = 'dochub/folder'
}

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
    name: string,
    contentType: DocHubContentType | string
}

/**
 * Метаинформация о папке
 */
export type DocHubResourceMetaFolder = {
    type: DocHubResourceType.folder,
    files: DocHubResourceMetaFile[]
}

/**
 * Метаинформация о прочих ресурсах
 */
export type DocHubResourceMetaOther = {
    type: DocHubResourceType.other,
    [prop: string]: any
}

type DocHubResourceMeta = DocHubResourceMetaFile | DocHubResourceMetaFolder | DocHubResourceMetaOther;

/**
 * Методы доступные над ресурсом
 */
export enum IDocHubProtocolMethods {
    // Classic
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    PUT = 'PUT',
    PATCH = 'PATCH',
    OPTIONS = 'OPTIONS',
    // WebDAV - Расширенные методы для работы ресурсами
    SCAN = 'SCAN'       // Сканирует ресурс URI и возвращает о нем расширенную информацию в формате DocHubResourceMeta
                        // Позволяет получать список файлов в папке
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
    availableMethodsFor(uri: string): Promise<IDocHubProtocolMethods[]>;
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
}