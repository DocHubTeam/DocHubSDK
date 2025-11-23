export type IDocHubLibrary = any;
export type DocHubLibraryID = string;
export type DocHubLibraryVersion = string;
export type DocHubLibraryRequireVersion = string;
export type DocHubLibraryExportVersion = string;

/**
 * Декларирует публикуемые плагином библиотеки
 */
export interface IDocHubLibrariesExport {
    [id: DocHubLibraryID]: DocHubLibraryExportVersion;
}

/**
 * Ручка для разрешения зависимости от библиотеки. Должна возвращать объект module.
 */
export type IDocHubLibraryResolver = (library: DocHubLibraryID) => Promise<IDocHubLibrary>;

/**
 * Интерфейс доступа к общим библиотекам, которые предоставляет плагин
 */
export interface IDocHubSharedLibraries {
    resolve: IDocHubLibraryResolver;
}

/**
 * Структура перечисления библиотек и их версий
 */
export interface IDocHubLibraryRequires {
    [id: DocHubLibraryID]: DocHubLibraryRequireVersion;
}

/**
 * Интерфейс управления библиотеками
 */
export interface IDocHubLibraries {
    /**
     * Проверяет доступна ли библиотека. 
     * Возвращает структуру где для каждой библиотеки указывается true если она доступна, либо false
     * @param libraries 
     */
    isAvailable(libraries: IDocHubLibraryRequires): Promise<{ [library: string]: boolean }>;
}

