import { DocHubEditorURI } from './editors';
import { DataLakePath } from './datalake';
import { IDocHubProtocolResponse } from './protocols';
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
    constructor?: string;   // Идентификатор конструктора объектов
    editor?: string;        // Идентификатор редактора объектов
}

/**
 * RegExp для указания URL объекта в DocHub
 */
export const DocHubObjectURLRegExp = '^\\@[a-zA-Z0-9_$\\.]{1,}(\\/[a-zA-Z0-9_$\\.]{1,}){1,}(\\?[^(#|\\/)]*){0,1}(\\#[^(#|\\/|\\?)]*){0,1}$';

/**
 * Специальный формат адресации к объектам DocHub
 * Формат:      @<ID объекта>/<путь к объекту>[?<параметр=значение>[&<параметр=значение>]][#<ID презентации>]
 * Например:    @document/dochub.welcome?username=r.piontik#bio
 */
export class DocHubObjectURL extends String {
    constructor(...args:any) {
        for (const value of args) {
            if (!(new RegExp(DocHubObjectURLRegExp)).test(value))
                throw new Error(`Incorrect DocHubObjectURL [${value}] The string must be in the following format ${DocHubObjectURLRegExp}`, );
        }
        super(...args);
        return this;
    }
}

/**
 * VUE компонент редактора объекта
 */
export interface IDocHubObjectEditorComponent {
}

/**
 * Метаинформация о редакторе объекта
 */
export interface IDocHubObjectEditorItem {
    component: IDocHubObjectEditorComponent;
    uid: string;
    title: string;
}

/**
 * Описывает контекст редактируемого объекта
 */
export interface IDocHubObjectEditorContext extends IDocHubObjectMeta {
    path?: DocHubObjectURL;     // Путь к объекту в Data Lake
                                // Если не определено берется из параметра openObjectEditor
    [key: string]: any;         // Произвольные ключи и значения
}

export enum DocHubObjectAppletSerializationFormat {
    svg = 'svg'
}

export interface IDocHubObjectAppletSymbolOptions {
    width?: number;         // Задает ширину символа в пикселях
    height?: number;        // Задает высоту символа в пикселях
}

export interface IDocHubObjectApplet {
    /**
     * Генерирует символ объекта для представления в различных контекстах.
     * Формат вывода svg
     */
    makeSymbol(options?:IDocHubObjectAppletSymbolOptions): Promise<string>;
    serialization(format: DocHubObjectAppletSerializationFormat): Promise<IDocHubProtocolResponse>;
}

/**
 * RegExp для указания пути в DataLake в DocHub
 */
export const ObjectPathRegExp = '^@[a-zA-Z0-9_$\.]+(\/[a-zA-Z0-9_$\.]+)+$';

/**
 * Путь к объекту в DataLake.
 * Последовательность ключей коллекций через "/".
 * Например: 
 *  docs/example
 *  components/dochub.main
 */
export class ObjectPath extends String {
    constructor(...args:any) {
        for (const value of args) {
            if (!(new RegExp(ObjectPathRegExp)).test(value))
                throw new Error(`Incorrect DataLakePath [${value}] The string must be in the following format ${ObjectPathRegExp}`);
        }
        super(...args);
        return this;
    }
}


// Интерфейс доступа к задекларированным объектам в DataLake
export interface IDocHubObjects {
    /**
     * Возвращает коллекцию задекларированных объектов
     * @returns             - Коллекция задекларированных объектов
     */
    fetch(): Promise<IDocHubObjectMeta[]>;
    /**
     * Возвращает метаинформацию об объекте
     * @param uid           - Идентификатор объекта
     */
    get(uid: string): Promise<IDocHubObjectMeta>;
    /**
     * Возвращает метаданные задекларированного объекта для указанного пути
     * @param path          - Путь к объекту 
     */
    getMetaByPath(path: ObjectPath): Promise<IDocHubObjectMeta | null>;
    /**
     * Регистрирует редактор объекта
     * @param uid           - Идентификатор типа объекта
     * @param component     - VUE компонент для редактирования объекта
     * @param title         - Название редактора объекта
     */
    registerEditor(uid: string, component: IDocHubObjectEditorComponent, title?: string);
    /**
     * Возвращает массив зарегистрированных редакторов объектов
     * @returns             - Массив зарегистрированных редакторов объектов
     */
    fetchEditors(): Promise<IDocHubObjectEditorItem[]>;
    /**
     * Возвращает компонент редактора объекта
     * @param uid           - Идентификатор типа объекта
     * @returns             - IDocHubEditorItem
     */
    getEditor(uid: string): Promise<IDocHubObjectEditorItem>;
    /**
     * Генерирует URL для редактирования объекта по указанному пути
     * @param path          - Путь к объекту
     */
    makeEditURLByPath(path: ObjectPath): Promise<DocHubEditorURI>;
    /**
     * Запрос на открытие объекта на пользовательское редактирование. Необязательно будет выполнен.
     * Если редактор уже открыт, активирует его.
     * @param path              - Путь к редактируемому объекту
     * @param context           - Контекст редактирования объекта. Необходим для связных редакторов и конструкторов.
     * @returns                 - Компонент редактора, если открытие оказалось успешным
     */
    openEditor(path: ObjectPath, context?: IDocHubObjectEditorContext): Promise<IDocHubObjectEditorComponent>;
    /**
     * Удаление объекта из DataLake
     * @param path              - Путь к объекту
     * @param targetFile        - Конкретный файл DataLake, где нужно удалить объект. Если не указан, определяется автоматически.
     */
    delete(path: ObjectPath, targetFile?: string): Promise<void>;
    /**
     * Выпускает апплет - самостоятельное микроприложение объекта.
     * @param object            - URI объекта, который должен быть выпущен
     */
    releaseApplet(object: DocHubObjectURL): Promise<IDocHubObjectApplet>;
    /**
     * Создает апплет из данных (десериализация)
     * @param data              - Необходимые данные для десериализации
     */
    makeApplet(data: IDocHubProtocolResponse): Promise<IDocHubObjectApplet>;

}

