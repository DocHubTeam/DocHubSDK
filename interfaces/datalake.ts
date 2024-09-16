export enum DataLakeChange {
    update = 'update',          // Обновление данных по указанному пути  
    remove = 'remove',          // Удаляет данные по указанному пути
};

// Хранит состояние редактора
export interface IDataLakeChange {
    // Действие над DataLake
    action: DataLakeChange;
    // Путь в DataLake куда вносятся изменения
    path: string;
    // Данные, которые вносятся в DataLake
    data: object | string | number | boolean;
    // Комментарии в манифест, где изменения будут зафиксированы
    comment: string;
}

// Интерфейс доступа к DataLake
export interface IDocHubDataLake {
    // Монтирует источник к загружаемым манифестам озера
    //  uri         - URI монтируемого ресурса
    mountManifest(uri: string);
    // Отмонтирует источник к загружаемым манифестам озера
    //  uri         - URI отключаемого ресурса
    unmountManifest(uri: string);
    // Требует перезагрузки ресурсов задействованных в озере данных
    //  uriPattern  - Шаблон проверки соответствия URI ресурса
    //                Если undefined - перезагружает все
    reload(uriPattern?: string | string[] | RegExp);
    // Внесение изменений в DataLake
    //  changes     - Массив изменений в DataLake 
    pushChanges(changes: IDataLakeChange[]);
}

