/**
 * Интерфейс для экспорта общих ресурсов из плагинов
 */
import { IDocHubLibraryResolver } from "./libraries";

/**
 * Экспортный метод общих ресурсов плагина
 */
export type DocHubSharedResources = () => Promise<IDocHubSharedResources>;

/**
 * Интерфейс общих ресурсов поставляемый плагином
 */
export interface IDocHubSharedResources {
    /**
     * Возвращает объект module для экспортируемой библиотеки
     */
    libraries?: {
        resolve: IDocHubLibraryResolver;
    }
}