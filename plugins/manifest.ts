import {
    IDocHubLibrariesExport,
    IDocHubLibraryRequires
} from "../interfaces/libraries";
import { 
    IDocHubJSONSchemaBase,
    IDocHubJSONSchemaObject
} from "../schemas/basetypes";

/**
 * Зависимости плагина от свойств ядра и других плагинов
 */
export interface IDocHubManifestDependencies {
    [module: string]: string;
}

export interface IDocHubPluginEnvironmentsAllOf extends IDocHubJSONSchemaBase {
    allOf: IDocHubJSONSchemaObject[]; 
}

export interface IDocHubPluginEnvironmentsAnyOf extends IDocHubJSONSchemaBase {
    anyOf: IDocHubJSONSchemaObject[]; 
}

export interface IDocHubPluginEnvironmentsOneOf extends IDocHubJSONSchemaBase {
    oneOf: IDocHubJSONSchemaObject[]; 
}

export interface IDocHubPluginManifestProps {
    building: {
        // Момент сборки
        moment: number;
        // Версия SDK сборки
        'dochub-sdk': string;
        // Коммит
        commit: string;
        // Версия node при сборке
        node: string;
        // Версия приложения в формате xx.xx.xx
        version: string;
    }
}

export type IDocHubManifestPlugins = string[];

export interface IDocHubPluginManifestEnvironments {
    [module: string]: string;
}

export type IDocHubPluginEnvironments = 
    | IDocHubJSONSchemaObject
    | IDocHubPluginEnvironmentsAllOf
    | IDocHubPluginEnvironmentsAnyOf
    | IDocHubPluginEnvironmentsOneOf;

// Класс задач решаемый плагином
export enum DocHubKind {
    editor = 'editor',      // Редактор артефактов
    differ = 'differ',      // Отражает разницу в версиях артефактов
    ui = 'ui',              // UI-элементы интерфейса
    datalake = 'datalake',  // Обеспечивает работу с DataLake
    provider = 'provider',  // Драйвер, обеспечивающий доступ к ресурсам (http/https/gitlab и т.д.)
    ai = 'ai'               // AI-агент
}

export type DocHubPluginKinds = DocHubKind[];

// События в IDE приводящие к загрузке плагина
export enum DocHubPluginActivationEvent {
    any = '*'   // При любом событии
}

export type DocHubPluginActivationEvents = DocHubPluginActivationEvent[];

/**
 * Декларация базовых способностей плагина
 */
export interface IDocHubPluginContributes {
    commands?: any;         // Команды появляются в Command Palette и могут привязываться к меню/клавишам
    menus?: any;            // Размещает команды в контекстных меню, панели редактора, explorer и т. д. + условия when.
    keybindings?: any;      // Горячие клавиши
    configuration?: any;    // Настройки расширения
}

/**
 * Структура манифеста плагина для DocHub
 */
export interface IDocHubPluginManifest {
    // Системное название плагина
    name: string;
    // Описание плагина
    description?: string;
    // Ключевые слова для поиска в репозитории плагинов
    keywords?: string[];
    // Автор/вендор
    author?: string;
    // Лицензия 
    license?: string;
    // Связанные ресурсы
    urls?: {
        homepage?: string;
        repository?: string;
        support?: string;
    }
    // Свойства приложения
    app_props: IDocHubPluginManifestProps;
    // Переменные среды исполнения
    app_environments?: IDocHubPluginManifestEnvironments;
    // Зависимость от общих библиотек в DocHub
    DocHubDependencies?: IDocHubLibraryRequires;
    // Экспортируемые общие библиотеки в DocHub
    DocHubExport?: IDocHubLibrariesExport;
    // Перечень классов задач решаемых плагином
    DocHubKind?: DocHubPluginKinds;
    // Перечень событий, который должен привести к активации плагина
    DocHubActivationEvents?: DocHubPluginActivationEvents;
    // Базовые способности плагина
    DocHubContributes?: IDocHubPluginContributes;
}