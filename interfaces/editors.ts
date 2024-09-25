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

// VUE компонент редактора
export interface IDocHubEditorComponent {
}

// Метаинформация о редакторе
export interface IDocHubEditorItem {
    component: IDocHubEditorComponent;
    uid: string;
}

// Редакторы документов
export interface IDocHubEditors {
    // Регистрирует редактор для типа документа
    register(uid: string, component: IDocHubEditorComponent);
    // Возвращает массив зарегистрированных редакторов 
    fetch(): string[];
    // Возвращает компонент редактора по идентификатору
    get(uid: string): IDocHubEditorItem;
}

