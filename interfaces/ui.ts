import { DocHubEditMode, DocHubEditorURI } from './editors';

export interface IDocHubUIComponent {
    
}

export enum DocHubUISlot {
    avatar = 'avatar',                              // Компонент монтируется в область аватаров
    toolbar = 'toolbar',                            // Компонент монтируется в область панелей инструментов
    explorer = 'explorer',                          // Компонент монтируется в область навигации 
    chat = 'chat',                                  // Компонент используется при вызове комьюнити чата
    codeViewer = 'code-viewer',                     // Компонент используется при рендере кода
    transactionView = 'transaction-view'            // Выводится на страницу исследования транзакции
}

/**
 * События интерфейса
 */
export enum DocHubUIEvents {
    mountedToSlot = '#dochub-ui-slot-mounted'        // В слот смонтирован компонент
}

export interface IDocHubUISlotOptions {
    /**
     * Заголовок компонента
     */
    title?: string;
    /**
     * Актуально для слота codeViewer. Определяет поддерживаемые языки. 
     * Если не указано, то считается, что поддерживаются все.
     * Приоритет при выборе вьювера будет отдаваться с явно определенной поддержкой.
     */
    languages?: string[];           
    /**
     * Режимы, в которых данный компонент актуален
     * Если пусто, то во всех
     */
    modes?: DocHubEditMode[];
    /**
     * Уникальный идентификатор компонента.
     * Нужен для автоматического сохранения параметров отображения, корреспонденции событий и т.п.
     * Если он не определен, то разработчик должен сам заботиться о всем.
     */
    uid?: string;
    /**
     * Определяет состояние развернутого виджета при первом использовании
     */
    expanded?: boolean;
    /**
     * Виджет реализующий минимальный функционал компонента.
     * Используется для компактного представления в соответствии со стратегией слота.
     */
    widget?: IDocHubUIComponent;
}

export interface IDocHubUISlotItem {
    slot: DocHubUISlot | string;
    component: IDocHubUIComponent;
    options?: IDocHubUISlotOptions;
}

export interface IDocHubHTMLElementMeta {
    /**
     * Ссылка на редактор 
     */
    editor?: DocHubEditorURI;   
}

/**
 * Слои доступные в UI контейнере DocHub
 */
export enum DocHubContainerLayers {
    fullscreen = 'fullscreen',  // Полноэкранное представление компонента
    zoom = 'zoom'               // Масштабирование представления
}

/**
 * Действия контейнера для слоя масштабирования
 */
export enum DocHubContainerZoomActions {
    reset = 'reset'
}

export interface IDocHubContainerAction {
    action: DocHubContainerZoomActions
}


export type IDocHubComponentMenuHandle = () => void;


/**
 * Пункт меню
 */
export interface IDocHubComponentMenuItem {
    title: string;                              // Заголовок меню
    handle: IDocHubComponentMenuHandle;         // Обработчик клика на меню
    icon?: string;                              // Иконка
    group?: string;                             // Группировка элементов меню
    subitems?: IDocHubComponentMenuItem[];      // Вложенные пункты
}

/**
 * Custom компонент пункта меню
 */
export interface IDocHubComponentMenuComponent {
    component: IDocHubUIComponent;
}

export type DocHubComponentMenuNode = IDocHubComponentMenuItem | IDocHubComponentMenuComponent;

/**
 * Если компонент имеет генерирует контекстное меню, он должен реализовывать этот интерфейс
 */
export interface IDocHubComponentMenuContext {
    /**
     * Генерирует контекстное меню
     * @returns         - возвращает структуру меню
     */
    menuContext(): Promise<DocHubComponentMenuNode[]>;
}

/**
 * Опции загрузки данных на клиентское устройство
 */
export interface IDocHubUIDownloadOptions {
    contentType?: string;
    filename?: string;
}

/**
 * Опции копирования данных на клиентское устройство
 */
export interface IDocHubUICopyClipboardOptions {
    contentType?: string;
}

/**
 * Указывает где загружать указанный URL 
 */
export enum DocHubUITargetWindow {
    _blank = '_blank',
    _self = '_self',
    _parent = '_parent',
    _top = '_top'
}

/**
 * Вариант выбора пользователя для запроса к нему
 */
export interface IDocHubUIMessageChoice {
    title: string;
    handler: () => void;
}

/**
 * Тип формы запроса к пользователю
 */
export enum DocHubUIMessageMode {
    question = 'question',
    info = 'info',
    warning = 'warning',
    error = 'error'
}

/**
 * Интерфейс управления UI компонентами для предопределенных слотов
 */
export interface IDocHubUI {
    /**
     * Короткое всплывающее сообщение
     * @param message       - Сообщение.
     * @param timeout       - Задержка в мс по умолчанию 3000
     */
    toast(message: string, timeout?: number);
    /**
     * Выполняет сообщение пользователю в стандартном модальном окне.
     * @param message       - Сообщение.
     * @param choice        - Массив с вариантами выбора
     */
    message(message: string, choice?: IDocHubUIMessageChoice[], mode?: DocHubUIMessageMode);
    /**
     * Регистрирует UI компонент в слоте
     * @param slot              - Идентификатор слота DocHubUISlot или произвольный для кастомных слотов
     * @param component         - VUE component
     * @param options           - Дополнительные опции
     */
    register(slot: DocHubUISlot | string, component: IDocHubUIComponent, options?: IDocHubUISlotOptions);
    /**
     * Возвращает зарегистрированные компонент по слоту
     * @param slot              - Идентификатор слота DocHubUISlot или произвольный для кастомных слотов
     * @returns                 - Список UI компонентов
     */
    get(slot: DocHubUISlot | string): Promise<IDocHubUISlotItem[]>;
    /**
     * Загружает данные на клиентское устройство
     * @param content           - Данные, сохраняемые в файл
     * @param options           - Параметры сохранения на клиентском устройстве
     */
    download(content: string | ArrayBuffer, options?:IDocHubUIDownloadOptions): Promise<void>;
    /**
     * Копирует данные в клипборд клиентского устройства
     * @param content           - Данные, сохраняемые в файл
     * @param options           - Параметры сохранения на клиентском устройстве
     */
    copyToClipboard(content: string | ArrayBuffer, options?:IDocHubUICopyClipboardOptions): Promise<void>;
}
