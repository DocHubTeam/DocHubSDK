// Компонент конструктора
export interface IDocHubConstructorComponent {
}

// Запись в коллекции о конструкторе
export interface IDocHubConstructorItem {
    component: IDocHubConstructorComponent;
    uid: string;
    title: string;
}

// Дополнительная метаинформация о конструкторе
export interface IDocHubConstructorMeta {
    description?: string;   // Описание смысла конструктора
    img?: string;           // Картинка для пользователя
}

// Параметры передаваемые в конструктор для его первичной инициализации
export interface IDocHubConstructorParams {
    [key: string]: any;
}

// Интерфейс конструкторов
export interface IDocHubConstructors {
    // Регистрирует конструктор
    //  uid         - Идентификатор конструктора
    //  title       - Краткое название конструктора
    //  component   - UI компонент конструктора
    //  meta        - Мета-информация о конструкторе
    register(uid: string, title: string, component: IDocHubConstructorComponent, meta?: IDocHubConstructorMeta);
    // Возвращает список конструкторов
    fetch():IDocHubConstructorItem[];
    // Возвращает запись коллекции по идентификатору 
    //  uid         - Идентификатор конструктора
    get(uid: string): IDocHubConstructorItem;
    // Вызывает магазин выбора конструкторов по указанному шаблону идентификаторов
    //  pattern     - шаблон идентификаторов по которому отбираются конструкторы
    //  target      - Целевое пространство для создания объекта
    showStore(pattern?: RegExp, target?: string, params?:IDocHubConstructorParams);
}

