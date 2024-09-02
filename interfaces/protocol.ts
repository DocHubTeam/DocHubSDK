import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { IDocHubContext } from './context';

// Прослойка интерфейсов Axios для последующей кастомизации и поддержания совместимости
export interface IDocHubProtocolRequestConfig extends AxiosRequestConfig {};
export interface IDocHubProtocolResponse extends AxiosResponse {};

// Методы доступные над ресурсом
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
    isActive(): Boolean;
    // Метод инициализации протокола
    bootstrap(context: IDocHubContext);
    // Разрешение ссылок
    resolveURL(...args: string[]): string;
    // Выполняет запрос к DataLake
    request(config: IDocHubProtocolRequestConfig): Promise<IDocHubProtocolResponse>;
    // Возвращает список методов доступных для указанного ресурса
    availableMethodsFor(uri: string): Promise<IDocHubProtocolMethods[]>;
}