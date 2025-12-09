/**
 * Строковое значение для нескольких языков
 */
export type DocHubLangStringMultilang = {
    [lang: string]: string;
}

/**
 * Строковое значение для организации мультиязычности.
 * Если имеет простой тип string - предполагается, что строка на английском. 
 */
export type DocHubLangString = string | DocHubLangStringMultilang;

/**
 * События языковых пакетов
 */
export enum DocHubLangEvents {
    changeLang = 'dochub-lang-change'       // Изменен язык
}

/**
 * Структура языкового фрагмента
 */
export interface IDocHubLangFragment {
    [lang: string]: any;
}

/**
 * Структура языкового пакета
 */
export interface IDocHubLangPackage {
    [id: string]: IDocHubLangFragment;
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
     * @param id            - Идентификатор языкового пакета
     * @param pkg           - Языковой пакет
     */
    registerPackage(id: string, pkg: any);
    
    /**
     * Генерирует текст с учетом текущего языка и переданных данных для параметров
     * @param path          - Путь к языковой константе <bundle>.<lang>.<const>[.<const>]
     * @param params        - Параметры для шаблона 
     */
    getText(path: string, params?: any): string;
    /**
     * Возвращает константу "как есть"
     * @param path          - Путь к языковой константе
     */
    getConst(path: string): any;
    /**
     * Отправляет запрос на переключение языка интерфейса
     * @param lang          - Язык на который нужно переключить
     * @returns             - Возвращает действующий язык
     */
    switchTo(lang: string): Promise<string>;

}
