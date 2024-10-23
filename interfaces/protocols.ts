import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { IDocHubContext } from './contexts';

// Прослойка интерфейсов Axios для последующей кастомизации и поддержания совместимости
export interface IDocHubProtocolRequestConfig extends AxiosRequestConfig {
    decoder?: Function;  // Декодировщик ответа
};
export interface IDocHubProtocolResponse extends AxiosResponse {};

/**
 * Методы доступные над ресурсом
 */
export enum IDocHubProtocolMethods {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    PUT = 'PUT',
    PATCH = 'PATCH',
    OPTIONS = 'OPTIONS'
};

// Интерфейс транспортного протокола
export interface IDocHubProtocol {
    // Признак активности протокола
    isActive(): boolean;
    // Метод инициализации протокола
    bootstrap(context: IDocHubContext);
    // Разрешение ссылок
    resolveURL(...args: string[]): string;
    // Выполняет запрос к DataLake
    request(config: IDocHubProtocolRequestConfig): Promise<IDocHubProtocolResponse>;
    // Возвращает список методов доступных для указанного ресурса
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