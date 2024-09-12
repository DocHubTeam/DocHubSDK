import { IDocHubContentProvider } from './content';
import { IDocHubProtocol } from './protocol';
import { IDocHubDocument } from './document';
import { IDocHubEditor } from './editor';
import { IDocHubUIComponent } from './uicomponent';

export interface IDocHubEnv {
    [id: string]: string
}

export interface IDocHubProblems {
    // Регистрирует ошибку в системе
    emit(problem: Error, title?: string, uid?: string);
}

export interface IDocHubSettingsCollection {
    [id: string]: any;
}

export interface IDocHubSettings {
    // Регистрирует UI компонент настроек
    //  component - VUE компонент
    //  location  - размещение UI компонента в дереве настроек
    //  tags      - массив тегов для поиска компонента настроек
    registerUI(component: any, location: string, tags: string[]);

    // Сохраняет структуру с настройками
    //  settings    -   сохраняемая структура
    push(settings: IDocHubSettingsCollection);

    // Получает настройки 
    //  fields      - требуемый массив полей
    pull(fields: IDocHubSettingsCollection | string[]): IDocHubSettingsCollection;
}

export interface IDocHubRouter {
    // Регистрирует роут в формате VUE2
    registerRoute(route: object);
    // Регистрирует middleware в формате VUE2
    registerMiddleware(middleware: object);
    // Указывает на какой роут перейти в DocHub
    navigate(url: string);
}

export interface IDocHubContentProviders {
    // Возвращает контент-провайдер по типу контента
    get(contentType: string): IDocHubContentProvider;
    // Регистрирует контент-провайдер
    register(contentType: string, provider: IDocHubContentProvider);
    // Возвращает массив зарегистрированных типов 
    fetch(): string[];
}

export interface IDocHubProtocols {
    // Возвращает драйвер протокола по идентификатору
    get(protocol: string): IDocHubProtocol;
    // Регистрирует драйвер протокола
    register(protocol: string, driver: IDocHubProtocol);
    // Возвращает массив зарегистрированных протоколов 
    fetch(): string[];
}

export interface IDocHubDocuments {
    // Регистрирует тип документа
    register(type: string, document: IDocHubDocument);
    // Возвращает массив зарегистрированных типов документов 
    fetch(): string[];
}

export interface IEditorParams {
    [key: string]: string;
}

export interface IDocHubEditors {
    // Регистрирует редактор для типа документа
    register(type: string, editor: IDocHubEditor, title?: string);
    // Возвращает массив зарегистрированных редакторов 
    fetch(): string[];
    // Открывает редактор
    openEditor(type: string, params?: IEditorParams, startCommand?: EditorEvents);
}

export interface IDocHubUI {
    // Регистрирует UI компонент в слоте
    register(slot: string, component: IDocHubUIComponent);
    // Возвращает зарегистрированный компонент по слоту
    get(slot: string): IDocHubUIComponent[];
}

export interface IDocHubDataLake {
    // Монтирует источник к загружаемым манифестам озера
    //  uri: string     - URI монтируемого ресурса
    mountManifest(uri: string);
    // Отмонтирует источник к загружаемым манифестам озера
    //  uri: string     - URI отключаемого ресурса
    unmountManifest(uri: string);
    // Требует перезагрузки ресурсов задействованных в озере данных
    //  uriPattern: array | RegEx | undefined  - Шаблон проверки соответствия URI ресурса
    //                                           Если undefined - перезагружает все
    reload(uriPattern?: string | string[] | RegExp);
}

// Главный интерфейс
export interface IDocHubCore {
    problems: IDocHubProblems;                  // Проблемы
    settings: IDocHubSettings;                  // Пользовательские настройки
    router: IDocHubRouter;                      // Работа с UI роутами
    contentProviders: IDocHubContentProviders;  // Провайдеры контента
    protocols: IDocHubProtocols;                // Протоколы доступа к данным
    documents: IDocHubDocuments;                // Документы
    editors: IDocHubEditors;                    // Редакторы
    ui: IDocHubUI;                              // UI порт
    dataLake: IDocHubDataLake;                  // Интерфейс к архкоду
}