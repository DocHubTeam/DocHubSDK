import { DocHubEditorContext } from './editors';

/**
 * Компонент конструктора
 */
export interface IDocHubConstructorComponent {
}

/**
 * Функция проверки корректности контекста для работы конструктора
 */
export type FContextValidator = (context: DocHubEditorContext) => Promise<boolean>;

// Дополнительная информация и опциональные методы конструктора
export interface IDocHubConstructorOptions {
    description?: string;               // Описание смысла конструктора
    img?: string;                       // Картинка для пользователя
    isValidContext?: FContextValidator; // Функция проверки корректности контекста для работы конструктора
}

/**
 * Запись в коллекции о конструкторе
 */
export interface IDocHubConstructorItem {
    component: IDocHubConstructorComponent;
    uid: string;
    title: string;
    options?: IDocHubConstructorOptions;
}

export type DocHubUID = string;

/**
 * Интерфейс конструкторов
 */
export interface IDocHubConstructors {
    /**
     * Регистрирует конструктор
     * @param uid           - Идентификатор конструктора
     * @param title         - Краткое название конструктора
     * @param component     - UI компонент конструктора
     * @param options       - Опции конструктора и дополнительные сведения о нем
     */
    register(uid: string, title: string, component: IDocHubConstructorComponent, options?: IDocHubConstructorOptions);
    /**
     * Возвращает коллекцию конструкторов
     * @returns             - Массив записей коллекции конструкторов
     */
    fetch():Promise<IDocHubConstructorItem[]>;
    /**
     * Возвращает запись коллекции по идентификатору 
     * @param uid           - Идентификатор конструктора
     * @returns             - Найденная запись коллекции конструкторов или null
     */
    get(uid: string):Promise<IDocHubConstructorItem | null>;
    /**
     * Вызывает магазин выбора конструкторов по указанному шаблону идентификаторов
     * @param pattern       - Шаблон идентификаторов по которому отбираются конструкторы
     * @param context       - Контекст который должен учесть конструктор, если он не определен, контекст будет создан автоматически
     */
    showStore(pattern?: RegExp, context?: DocHubEditorContext);
    /**
     * Создает глобальный уникальный идентификатор
     */
    makeUID(): DocHubUID;
}

