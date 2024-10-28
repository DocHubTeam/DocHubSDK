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
    close = '$close',               // Требует закрыть редактор
    save = '$save',                 // Требует произвести сохранение 
    create = '$create',             // Требует создать новый объект
    delete = '$delete'              // Требует удалить объект
};

/**
 * Хранит состояние редактора
 */
export interface IEditorState {
    title: string
}
