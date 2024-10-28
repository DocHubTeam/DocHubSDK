/**
 * Содержит метаданные задекларированного объекта
 */
export interface IDocHubObjectMeta {
    uid: string;            // Идентификатор объекта
    entity: string;         // Идентификатор сущности
    presentation: string;   // Идентификатор презентации объекта
    route: string;          // Параметризируемый путь к объекту в DataLake
    symbol?: string;        // Символ объекта для визуализации на диаграммах
    title?: string;         // Название объекта
    description?: string;   // Описание объекта
    constructor?: string;   // RegEx паттерн конструктора объектов
}

/**
 * VUE компонент редактора объекта
 */
export interface IDocHubObjectEditorComponent {
}

/**
 * Метаинформация о редакторе объекта
 */
export interface IDocHubEditorObjectItem {
    component: IDocHubObjectEditorComponent;
    uid: string;
}

// Интерфейс доступа к задекларированным объектам в DataLake
export interface IDocHubObjects {
    /**
     * Возвращает коллекцию задекларированных объектов
     * @returns             - Коллекция задекларированных объектов
     */
    fetch(): Promise<IDocHubObjectMeta[]>;
    /**
     * Возвращает объект
     * @param uid           - Идентификатор объекта
     */
    get(uid: string): Promise<IDocHubObjectMeta>;
    /**
     * Возвращает метаданные задекларированного объекта для указанного пути
     * @param path          - Путь к объекту 
     */
    getMetaObjectByPath(path: string): Promise<IDocHubObjectMeta | null>;
    /**
     * Регистрирует редактор объекта
     * @param uid           - Идентификатор типа объекта
     * @param component     - VUE компонент для редактирования объекта
     */
    registerEditor(uid: string, component: IDocHubObjectEditorComponent);
    /**
     * Возвращает массив зарегистрированных редакторов объектов
     * @returns             - Массив зарегистрированных редакторов объектов
     */
    fetchEditors(): Promise<IDocHubEditorObjectItem[]>;
    /**
     * Возвращает компонент редактора объекта
     * @param uid           - Идентификатор типа объекта
     * @returns             - IDocHubEditorItem
     */
    getEditor(uid: string): Promise<IDocHubEditorObjectItem>;    
}

