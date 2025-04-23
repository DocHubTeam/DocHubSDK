import { DocHubDataSetProfileSource, IDocHubDataSetProfile } from './jsonata';
import { DataLakePath } from './datalake';
import { DocHubJSONSchema } from './../schemas/basetypes';

/**
 * Идентификатор типа презентации
 */
export type DocHubPresentationUID = string;

/**
 * VUE компонент презентации
 */
export interface IDocHubPresentationComponent {}

/**
 * Входящие параметры в презентацию
 */
export interface IDocHubPresentationsParams {
    [key: string]: string;
}

/**
 * Профиль презентации
 */
export interface IDocHubPresentationProfile extends IDocHubDataSetProfile {
    // Идентификатор типа презентации 
    type?: string;
    // Название презентации
    title?: string;
    // Шаблон представления
    template?: string;
    // Схема требуемых параметров для презентации
    params?: DocHubJSONSchema;
    // Пользовательский конструктор профиля презентации
    $constructor?: DocHubDataSetProfileSource;
}

/**
 * Интерфейс управления презентациями сущностей
 */
export interface IDocHubPresentations {
    /**
     * Регистрирует тип презентации
     * @param type          - Тип презентации. Например "markdown"
     * @param component     - VUE компонент презентации
     * @param title         - Название типа презентации для пользователя
     */
    register(type: DocHubPresentationUID, component: IDocHubPresentationComponent, title?: string);
    /**
     * Возвращает компонент презентации по идентификатору типа
     * @param type          - Тип презентации. Например "markdown"
     * @returns             - VUE компонент для представления
     */
    getComponentByType(type: DocHubPresentationUID): Promise<IDocHubPresentationComponent>;
    /**
     * Возвращает список зарегистрированных типов презентаций
     * @returns             - Массив типов презентаций
     */
    fetch(): Promise<string[]>
}