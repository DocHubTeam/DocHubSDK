import { Route, RouteConfig } from 'vue-router';

export enum DocHubNavigateCommands {
    back = '$-back',                                    // Перейти на шаг назад в истории страниц
    root = '$-root',                                    // Перейти на корневую страницу    
    transactionView = '$-transaction-view',             // Перейти на страницу анализа изменений
}

export enum DocHubNavigateTarget {
    blank = '_blank',
    self = '_self',
    parent = '_parent',
    top = '_top'
}

/**
 * Обработчик изменения расположения
 */
export type DocHubLocationWatcher = (location: URL) => void;

/**
 * Обработчик middleware роутера
 */
export type DocHubRouterMiddlewareHandle = (to, from, next) => Promise<void>;

/**
 * Интерфейс middleware
 */
export interface IDocHubRouterMiddleware {
    beforeEach?: DocHubRouterMiddlewareHandle;
}

/**
 * Интерфейс роута
 */
export type IDocHubRouterRoute = RouteConfig;

/**
 * Интерфейс роутера
 */
export interface IDocHubRouter {
    /**
     * Регистрирует роут
     * @param route         - Профиль роута
     */
    registerRoute(route: IDocHubRouterRoute);
    /**
     * Регистрирует middleware
     * @param middleware    - Профиль middleware
     */
    registerMiddleware(middleware: IDocHubRouterMiddleware);
    /**
     * Указывает на какой роут перейти в DocHub
     * @param url           - URL перехода
     * @param target        - Целевое окно перехода (_self по умолчанию)
     */
    navigate(url: string | DocHubNavigateCommands, target?:DocHubNavigateTarget);
    /**
     * Регистрирует наблюдателя за текущим location
     */
    registerLocationWatcher(watcher: DocHubLocationWatcher);
    /**
     * Удаляет наблюдателя за текущим location
     */
    unregisterLocationWatcher(watcher: DocHubLocationWatcher);
    /**
     * Возвращает текущий location
     */
    getLocation():Promise<URL>;
}