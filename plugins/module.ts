/**
 * Декларирует интерфейс, который должен реализовать js-модуль плагина
 */

import { IDocHubSharedResources } from "../interfaces/shared";

/**
 * Функция инициализации плагина в режиме frontend
 */
export type DocHubFrontendBootstrap = () => Promise<void>;

/**
 * Функция инициализации плагина в режиме backend
 */
export type DocHubBackendBootstrap = () => Promise<void>;

/**
 * Загрузочный интерфейс плагина
 */
export interface IDocHubPluginBootstrap {
    frontend?: DocHubFrontendBootstrap;
    backend?: DocHubBackendBootstrap;
}

/**
 * Интерфейс, который обязан реализовать плагин
 */
export interface IDocHubPlugin {
    bootstrap?: IDocHubPluginBootstrap;
    shared?: IDocHubSharedResources;
}