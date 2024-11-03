export interface IDocHubSettingsCollection {
    [id: string]: any;
}

/**
 * События работы с настройками
 */
export enum SettingsEvents {
    onChanged = 'settings.changed',        // Настройки изменены
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