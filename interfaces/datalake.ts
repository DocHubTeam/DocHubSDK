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
    // В результате возвращает список выполненных преобразований
    pushData(changes: IDataLakeChange[]): Promise<IDataLakeChange[]>;
    // Получение данных из DataLake
    //  expression  - JSONata выражение
    //  params      - коллекция параметров (необязательно)
    //  context     - контекст исполнения запроса (необязательно)
    pullData(expression: string, params?: IDocHubPullDataParams, context?: any): Promise<any>;
    // Сохраняет файла в DataLake
    //  uri         - URI файла во внутреннем формате DocHub
    //  context     - данные, которые требуется сохранить как файл
    // В результате возвращает статус выполненного запроса
    pushFile(uri: string, content: any): Promise<any>;
    // Получает файла из DataLake
    //  uri         - URI файла во внутреннем формате DocHub
    // В результате возвращает статус выполненного запроса
    pullFile(uri: string): Promise<any>;
    // Возвращает конечный URI на основании массива относительных и прямых URI
    resolveURI(...uri: string[]): string;
}

