import { IDocHubUIComponent } from './uicomponents';
import { DocHubEditMode } from './editors';

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

/**
 * Интерфейс управления UI компонентами для предопределенных слотов
 */
export interface IDocHubUI {
    // Регистрирует UI компонент в слоте
    register(slot: DocHubUISlot, component: IDocHubUIComponent, options?: IDocHubUISlotOptions);
    // Возвращает зарегистрированный компонент по слоту
    get(slot: string): IDocHubUIComponent[];
}
