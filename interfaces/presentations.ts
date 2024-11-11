import { DocHubDataLakeRequest, DataLakePath } from './datalake';
import { IDocHubSchema } from './../schemas/basetypes';

/**
 * Входящие параметры в презентацию
 */
export interface IDocHubPresentationsParams {
    [key: string]: string;
}

/**
 * Профиль презентации
 */
export interface IDocHubPresentationProfile {
    // Идентификатор типа презентации 
    type?: string;
    // Название презентации
    title?: string;
    // Источник данных для представления
    source?: string | DocHubDataLakeRequest;
    // Шаблон представления
    template?: string;
    // Схема требуемых параметров для презентации
    params?: IDocHubSchema;
    // Пользовательский конструктор профиля презентации
    $constructor?: DocHubDataLakeRequest;
    // Базовый путь к объекту от которого будут разрешаться все относительные пути
    $base: DataLakePath
}


/**
 * Интерфейс управления презентациями сущностей
 */
export interface IDocHubPresentations {
}