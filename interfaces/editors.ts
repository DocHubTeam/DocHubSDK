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
     * События редактора
     */
    close = '$close',               // Требует закрыть редактор
    save = '$save',                 // Требует произвести сохранение 
    create = '$create',             // Требует создать новый объект
    delete = '$delete'              // Требует удалить объект
};


/**
 * Тип редактора
 */
export enum DocHubEditorType {
    file = 'file',
    object = 'object'
}

/**
 * Контекст редактора
 */
export type DocHubEditorFileContext = {
    type: DocHubEditorType.file,
    meta: IDocHubFileEditorContext
}

/**
 * Контекст редактора объекта
 */
export type DocHubEditorObjectContext = {
    type: DocHubEditorType.object,
    meta: IDocHubObjectEditorContext
}

/**
 * Универсальный контекст редактора
 */
export type DocHubEditorContext = DocHubEditorFileContext | DocHubEditorObjectContext;
