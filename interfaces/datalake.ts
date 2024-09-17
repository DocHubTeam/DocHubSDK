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

export interface IDocHubPullDataParams  {
    [key: string]: any;
}

// Интерфейс доступа к DataLake
export interface IDocHubDataLake {
    // Монтирует ресурс в озера
    //  uri         - URI монтируемого ресурса
    mount(uri: string);
    // Демонтирует ресурс от озера
    //  uri         - URI демонтируемого ресурса
    unmount(uri: string);
    // Требует перезагрузки ресурсов задействованных в озере данных
    //  uriPattern  - Шаблон проверки соответствия URI ресурса
    //                Если undefined - перезагружает все
    reload(uriPattern?: string | string[] | RegExp);
    // Внесение изменений в DataLake
    //  changes     - Массив изменений в DataLake 
    push(changes: IDataLakeChange[]);
    // Получение данных из DataLake
    //  expression  - JSONata выражение
    //  params      - коллекция параметров (необязательно)
    //  context     - контекст исполнения запроса (необязательно)
    pull(expression: string, params?: IDocHubPullDataParams, context?: any);
}

