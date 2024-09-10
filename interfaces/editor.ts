export enum EditorEvents {
    close = '$close',               // Требует закрыть редактор
    save = '$save',                 // Требует произвести сохранение 
    create = '$create',             // Требует создать новый документ
    delete = '$delete'              // Требует удалить документ
};

export interface IDocHubEditor {
    title: string;                // Заголовок для закладки в редакторе  
}
