export interface IDocHubEditor {
    title: string;                // Заголовок для закладки в редакторе  
    close(): Promise<boolean>;    // Требует закрыть редактор
    save(): Promise<boolean>;     // Требует произвести сохранение 
    create(): Promise<boolean>;   // Требует создать новый документ
    delete(): Promise<boolean>;   // Требует удалить документ
}
