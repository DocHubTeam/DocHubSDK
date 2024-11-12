import { IDocHubFileEditorContext } from './datalake';
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
     * Отправляет запрос на начало редактирования
     */
    openEditor(): void;
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
    contextAppend  = '$edit-context-append',    // Контекст добавлен 
    contextUpdated = '$edit-context-updated',   // Контекст претерпел изменения
    contextRemoved = '$edit-context-removed',   // Контекст удален
    /**
     * События редактора
     */
    close = '$close',                           // Требует закрыть редактор
    save = '$save',                             // Требует произвести сохранение 
    create = '$create',                         // Требует создать новый объект
    delete = '$delete'                          // Требует удалить объект
};


/**
 * Тип редактора
 */
export enum DocHubEditorType {
    file = 'file',
    object = 'object'
}

export type DocHubContextUID = DocHubUID;

/**
 * Контекст редактора
 */
export type DocHubEditorFileContext = {
    uid: DocHubContextUID;
    type: DocHubEditorType.file,
    title?: string;
    meta: IDocHubFileEditorContext
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
}