// Компонент конструктора
export interface IDocHubConstructorComponent {
}

// Запись в коллекции о конструкторе
export interface IDocHubConstructorItem {
    component: IDocHubConstructorComponent;
    uid: string;
    title: string;
}

// Интерфейс конструкторов
export interface IDocHubConstructors {
    // Регистрирует конструктор
    register(uid: string, title: string, component: IDocHubConstructorComponent);
    // Возвращает список конструкторов
    fetch():IDocHubConstructorItem[];
    // Возвращает запись коллекции по идентификатору 
    get(uid: string): IDocHubConstructorItem;
}

