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

// Интерфейс конструкторов
export interface IDocHubConstructors {
    // Регистрирует конструктор
    register(uid: string, title: string, component: IDocHubConstructorComponent, meta?: IDocHubConstructorMeta);
    // Возвращает список конструкторов
    fetch():IDocHubConstructorItem[];
    // Возвращает запись коллекции по идентификатору 
    get(uid: string): IDocHubConstructorItem;
}

