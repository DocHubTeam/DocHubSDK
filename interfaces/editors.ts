import { IDocHubFileEditorOptions } from './datalake';
import { IDocHubObjectEditorContext } from './objects';
import { DocHubUID } from './constructors';

/**
 * Режим функционирования 
 */
export enum DocHubEditMode {
    editWeb = 'edit-web',
    editIDE = 'edit-ide',
    view = 'view'
}

export type IDocHubEditableMetaEditEntryHandle = () => void;

/**
 * Точки входя для редактирования
 */
export interface IDocHubEditableMetaEditEntry {
    title: string;
    icon?: string;
    handle: IDocHubEditableMetaEditEntryHandle;
}
/**
 * Мета информация о редактируемом объекте
 */
export interface IDocHubEditableMeta {
    title: string;  // Название объекта редактирования. Выводится пользователя, например, в выпадающем меню
    icon?: string;  // Иконка соответствующая объекту редактирования
    entries?: IDocHubEditableMetaEditEntry[];    // Точки входя для редактирования. Если точки не определены, то используется редактор по умолчанию openEditor
}
/**
 * Если компонент имеет возможность контекстного редактирования, он должен реализовывать данный интерфейс
 */
export interface IDocHubEditableComponent {
    /**
     * Указывает на то, что компонент может быть отредактирован
     * @returns         - возвращает true если компонент может быть отредактирован, иначе false
     */
    isEditable(): boolean;
    /**
     * Отправляет запрос на редактирование с использованием редактора по умолчанию
     */
    openEditor(): void;
    /**
     * Возвращает метаинформацию по редактированию
     */
    getMetaEdit(): Promise<IDocHubEditableMeta>;
}
/**
 * События, которые должен обрабатывать редактор
 */
export enum EditorEvents {
    /**
     * События режимов
     */
    modeChanged = '$mode-changed',  // Режим портала изменился
    /**
     * События контекста редактора
     */
    contextAppend  = '#edit-context-append',    // Контекст добавлен 
    contextUpdated = '#edit-context-updated',   // Контекст претерпел изменения
    contextRemoved = '#edit-context-removed',   // Контекст удален
    contextChanged = '#edit-context-changed',   // Текущий контекст сменился
    /**
     * События редактора
     */
    save = '#edit-save',                        // Требует произвести сохранение 
    saveAs = '#edit-save-as',                   // Требует произвести сохранение с новым именем
    goto = '#edit-goto',                        // Требует перейти в указанное пространство
    create = '#edit-create',                    // Требует создать файл или объект
};
/**
 * Тип редактора
 */
export enum DocHubEditorType {
    file = 'file',
    object = 'object',
    desk = 'desk'
}

export type DocHubContextUID = DocHubUID;
/**
 * Контекст редактора
 */
export type DocHubEditorFileContext = {
    uid: DocHubContextUID;
    type: DocHubEditorType.file,
    title?: string;
    meta: IDocHubFileEditorOptions
}
/**
 * Контекст редактора объекта
 */
export type DocHubEditorObjectContext = {
    uid: DocHubContextUID;
    type: DocHubEditorType.object,
    title?: string;
    meta: IDocHubObjectEditorContext
}

export type DocHubEditorURI = string;
/**
 * Универсальный контекст редактора
 */
export type DocHubEditorContext = DocHubEditorFileContext | DocHubEditorObjectContext;
/**
 * Предопределенный идентификатор контекста рабочего стола
 */
export const DESK_CONTEXT_UID = '00000000-0000-0000-0000-000000000000';
/**
 * Интерфейс взаимодействия с редакторами
 */
export interface IDocHubEditors {
    /**
     * Возвращает текущий контекст редактирования
     * @returns     - Текущий контекст редактирования или null
     */
    getCurrentContext(): Promise<DocHubEditorContext | null>;
    /**
     * Возвращает контекст по UID
     * @param uid   - Идентификатор контекста
     */
    getContextByUID(uid: DocHubContextUID): Promise<DocHubEditorContext | null>;
    /**
     * Возвращает список всех доступных контекстов
     */
    fetchContexts(): Promise<DocHubEditorContext[] | null>;
    /**
     * Монтирует область данных в контекст редактирования.
     * Смонтированная область будет доступна ВО ВСЕХ контекстах.
     * @param prop  - Свойство в context.meta
     * @param data  - Данные, которые будут смонтированы
     */
    mountContextArea(prop: string, data: any);
}