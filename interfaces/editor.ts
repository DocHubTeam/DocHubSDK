import { DocumentEvents } from "./document";

export enum EditorEvents {
    onEditClose = 'on-editor-close',
    onEditSave = 'on-editor-save',
    onEditCreate = 'on-editor-create',
    onEditDelete = 'on-editor-delete'
}

export interface IDocHubEditor {
    close(): Promise<boolean>;    // Требует закрыть редактор
    save(): Promise<boolean>;     // Требует произвести сохранение 
    create(): Promise<boolean>;   // Требует создать новый документ
    delete(): Promise<boolean>;   // Требует удалить документ
}

export interface IDocHubEditAPI {
    mountEditor(editor: IDocHubEditor, propsData: any);
    unmountEditor(editor: IDocHubEditor);
}

