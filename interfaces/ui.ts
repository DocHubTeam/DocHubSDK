import { IDocHubUIComponent } from './uicomponents';
import { }

export enum DocHubUISlot {
    avatar = 'avatar',
    toolbar = 'toolbar',
    explorer = 'explorer'
}

export interface IDocHubUISlotOptions {
    title?: string;
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
