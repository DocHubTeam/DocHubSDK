export type IDocHubLibrary = any;
export type DocHubLibraryID = string;
export type DocHubLibraryVersion = string;
export type DocHubLibraryRequireVersion = string;
/**
 * Интерфейсы публикуемых плагинами библиотек
 */
export interface IDocHubLibraryExportProfile {
    /**
     * Если библиотека имеет исходники для сборки, здесь указывается путь к ним.
     * Ссылка на исходники позволяет при разработке обращаться к декларациям интерфейсов и функций библиотек,
     * а также, при необходимости внедрять библиотеки непосредственно в плагины.
     */
    srcPath?: string;
    /**
     * Реализация загрузки модуля.
     * В результате вызова данной функции необходимо вернуть ссылку на загруженный модуль.
     */
    import(): Promise<IDocHubLibrary>;
    /**
     * Версия библиотеки
     */
    version: DocHubLibraryVersion;
}

/**
 * Декларирует публикуемые плагином библиотеки
 */
export interface IDocHubLibrariesExport {
    [id: DocHubLibraryID]: IDocHubLibraryExportProfile;
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
     * Публикует библиотеки для всех желающих
     * @param libraries - структура экспорта
     */
    export(libraries: IDocHubLibrariesExport);
    /**
     * При вызове будет ожидать загрузки необходимых библиотек.
     * Если загрузка хотя бы одной библиотеки не удастся, возникнет ошибка.
     * @param libraries - список необходимых библиотек
     */
    requires(libraries: IDocHubLibraryRequires): Promise<void>;
    /**
     * Проверяет доступна ли библиотека. 
     * Возвращает структуру где для каждой библиотеки указывается true если она доступна, либо false
     * @param libraries 
     */
    isAvailable(libraries: IDocHubLibraryRequires): Promise<{ [library: string]: boolean }>;
}

