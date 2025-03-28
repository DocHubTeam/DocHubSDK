/**
 * Зависимости плагина от свойств ядра и других плагинов
 */
export interface IDependencies {
    [module: string]: string;
}

/**
 * Структура манифеста плагина для DocHub
 */
export interface IDocHubPluginManifest {
    // Системное название плагина
    name: string;
    // Описание плагина
    description: string;
    // Версия в формате xx.xx.xx
    version: string;
    // Ключевые слова для поиска в репозитории плагинов
    keywords: string[];
    // Автор/вендор
    author: string;
    // Лицензия 
    license: string;
    // Связанные ресурсы
    urls: {
        homepage: string;
        repository: string;
        support: string;
    }
    // Зависимости
    dependencies: IDependencies;
}