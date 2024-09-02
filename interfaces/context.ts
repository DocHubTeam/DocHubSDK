// Интерфейс переменных среды исполнения
export interface IDocHubContextEnv {
    readonly [key: string]: any;
}

// Интерфейс контекста для выполнения плагина
export interface IDocHubContext {
    // Переменные среды
    env: IDocHubContextEnv;
    // Метод регистрации ошибки
    emitError(error: Error, title?: string, uid?: string);
}