export enum EditorEvents {
    close = '$close',               // Требует закрыть редактор
    save = '$save',                 // Требует произвести сохранение 
    create = '$create',             // Требует создать новый документ
    delete = '$delete'              // Требует удалить документ
};

// Хранит состояние редактора
export interface IEditorState {
    title: string
}

// Редактор должен реализовывать данный интерфейс
export interface IDocHubEditor {
 
}
