import { IDocHubFileEditorContext } from './datalake';
import { IDocHubObjectEditorContext } from './objects';

/**
 * Режим функционирования 
 */
export enum DocHubEditMode {
    editWeb = 'edit-web',
    editIDE = 'edit-ide',
    view = 'view'
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

export type DocHubContextUID = string;

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
}