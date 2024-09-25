export enum EditorEvents {
    close = '$close',               // Требует закрыть редактор
    save = '$save',                 // Требует произвести сохранение 
    create = '$create',             // Требует создать новый объект
    delete = '$delete'              // Требует удалить объект
};

// Хранит состояние редактора
export interface IEditorState {
    title: string
}

// Редактор должен реализовывать данный интерфейс
export interface IDocHubEditor {
}

// Редакторы документов
export interface IDocHubEditors {
    // Регистрирует редактор для типа документа
    register(type: string, editor: IDocHubEditor);
    // Возвращает массив зарегистрированных редакторов 
    fetch(): string[];
    // Возвращает компонент редактора по идентификатору
    get(uid: string): IDocHubEditor;
}

