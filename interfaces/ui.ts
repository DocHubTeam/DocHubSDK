import { IDocHubUIComponent } from './uicomponents';

export enum DocHubUISlot {
    avatar = 'avatar',
    toolbar = 'toolbar'
}

export interface IDocHubUI {
    // Регистрирует UI компонент в слоте
    register(slot: DocHubUISlot, component: IDocHubUIComponent);
    // Возвращает зарегистрированный компонент по слоту
    get(slot: string): IDocHubUIComponent[];
}
