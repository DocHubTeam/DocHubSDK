import { IDocHubUIComponent } from './uicomponents';
import { DocHubEditMode, DocHubEditorURI } from './editors';


export enum DocHubUISlot {
    avatar = 'avatar',
    toolbar = 'toolbar',
    explorer = 'explorer'
}

export interface IDocHubUISlotOptions {
    /**
     * Заголовок компонента
     */
    title?: string;
    /**
     * Режимы, в которых данный компонент актуален
     * Если пусто, то во всех
     */
    modes?: DocHubEditMode[];
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
 * Интерфейс управления UI компонентами для предопределенных слотов
 */
export interface IDocHubUI {
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
     * Обогащает HTML элемент метаданными для контекстного взаимодействия в UI
     */
    appendMetaToElement(meta:IDocHubHTMLElementMeta);
}
