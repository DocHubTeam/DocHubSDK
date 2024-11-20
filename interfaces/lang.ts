import { DocHubEditMode, DocHubEditorURI } from './editors';

/**
 * События языковых пакетов
 */
export enum IDocHubLangEvents {
    changeLang = 'dochub-lang-change'       // Изменен язык
}

/**
 * Структура языкового пакета
 */
export interface IDocHubLangPackage {
    [bundle: string]: any;
}

/**
 * Интерфейс управления языковыми пакетами
 */
export interface IDocHubLang {
    /**
     * Возвращает текущий язык
     * @returns     - язык ru/en/...
     */
    currentLang() : string;
    /**
     * Регистрация языкового пакета
     * @param pkg           - Языковой пакет
     */
    registerPackage(pkg: IDocHubLangPackage);
    
    /**
     * Генерирует текст с учетом текущего языка и переданных данных для параметров
     * @param path          - Путь к языковой константе <bundle>.<const>[.<const>]
     * @param context       - Контекст с учетом которого будут вычисляться выражения шаблонов
     */
    get(path: string, context?: any): string;
}
