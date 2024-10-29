import { IDocHubCore } from "dochub-sdk/interfaces/core";

// Интерфейс переменных среды исполнения
export interface IDocHubContextEnv {
    readonly [key: string]: any;
}

// Интерфейс контекста для выполнения плагина
export interface IDocHubContext {
    // Переменные среды
    env: IDocHubContextEnv;
}