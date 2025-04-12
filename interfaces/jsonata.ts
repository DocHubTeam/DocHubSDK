import { DocHubJSONSchema } from '../schemas/basetypes';
import { DocHubDataLakeInitializedStatus, IDocHubTransaction } from './datalake';

/**
 * Идентификатор источника данных
 */
export type DocHubDataSetID =  string;
/**
 * Данные не требующие обработку
 */
export type DocHubDataSetData = object;
/**
 * JSONata запрос с расширенными свойствами
 */

/**
 * Простое, строковое определение JSONata запроса
 */
export type DocHubJSONataQuerySimple = `(${string})` | `jsonata(${string})`;

/**
 * Ссылка на JSONata файл
 */
export type DocHubJSONataFile = `${string}.jsonata`;

/**
 * Метаинформация JSONata запроса
 */
export interface DocHubJSONataQueryMeta {
    /**
     * URI ресурса, где декларирован запрос 
     */
    source?: string;
    /**
     * Путь к свойству определения
     */
    path?: string;
}

/**
 * Класс, позволяет создавать запросы с расширенной информацией об источнике его происхождения
 * для удобства отладки.
 */
export class DocHubJSONataQueryObject extends String {
    /**
     * URI ресурса, где определен запрос
     */
    private uri: string | undefined;
    /**
     * Путь к определению запроса
     */
    private path: string | undefined;
    constructor(query: DocHubJSONataQuerySimple, uri?: string, path?: string) {
        super(query);
        this.uri = uri;
        this.path = path;
        return this;
    }
    get __uri__(): string | undefined {
        return this.uri;
    }
    get __path__(): string | undefined {
        return this.path;
    }
}

/**
 * JSONata запрос
 */
export type DocHubJSONataQuery =  DocHubJSONataQuerySimple | DocHubJSONataQueryObject;

/**
 * Ссылка на файл данных
 */
export type DocHubDataFileFile = string;
/**
 * Тип поля source описывающий возможные источники данных
 */
export type DocHubDataSetProfileSource = DocHubDataSetID | DocHubJSONataQuery | DocHubJSONataFile | DocHubDataFileFile | DocHubDataSetData;
/**
 * Набор источников для поля origin
 */
export interface DocHubDataSetProfileOriginSet {
    [key: string]: DocHubDataSetProfileSource
}
/**
 * Тип поля origin для источника данных
 */
export type DocHubDataSetProfileOrigin = DocHubDataSetProfileSource | DocHubDataSetProfileOriginSet;

/**
 * Интерфейс стандартизирующий источник данных
 */
export interface IDocHubDataSetProfile {
    origin?: DocHubDataSetProfileOrigin;
    source: DocHubDataSetProfileSource;
}

export enum DocHubDataLakeDebuggerHandleActions {
    run = 'run',    // Продолжить выполнение
    next = 'next',  // Перейти на следующий шаг
    into = 'into',  // Войти в подпрограмму
    stop = 'stop'   // Прервать выполнение 
}

/**
 * Специальный тип запросов в отладчик.
 * Если запрос начинается на $, считается, что запрос должен вернуть значение переменной из контекста выполнения
 */
export type DocHubDebuggerQuery = `$${string}` | DocHubJSONataQuery;

export type DocHubDataLakeDebuggerQuery = (expression: DocHubDebuggerQuery) => Promise<any>;


/**
 * Элемент стека выполнения запросов в DataLake
 */
export interface IDocHubDataLakeDebuggerCallStackItem {
    position: number;                       // Указывает на каком символе в source сейчас выполнение
    source: () => Promise<string>;          // Возвращает исходный код запроса
    variables: () => Promise<string[]>;     // Возвращает список переменных запроса
    query: DocHubDataLakeDebuggerQuery;     // Выполнение произвольного запроса в контексте данного запроса
}

/**
 * Стек запросов в DataLake
 */
export type DocHubDataLakeDebuggerCallStack = IDocHubDataLakeDebuggerCallStackItem[];

/**
 * Контекст запроса в DataLake
 */
export interface IDocHubDataLakeDebuggerContext {
    uid: string;                                                    // Идентификатор запроса
    stack?: () => Promise<DocHubDataLakeDebuggerCallStack>;         // Стек выполнения запроса
    terminated?: boolean;                                           // Признак завершения выполнения запроса        
}

/**
 * Интерфейс внутрисистемного отладчика
 */
export interface IDocHubDataLakeDebugger {
    /**
     * Метод вызывается при необходимости отладочного действия
     * @param context           - контекст исполнения кода
     */
    handle(context: IDocHubDataLakeDebuggerContext): Promise<DocHubDataLakeDebuggerHandleActions>;
}

export type JSONataExpression = string;
export interface JSONataExpressionBinds {
    [variable: string]: any;
}

/**
 * Интерфейс объекта запроса
 */
export interface IDocHubJSONataQuery {
    /**
     * Выполняет запрос
     */
    evaluate(context: JSONataExpression, binds?: JSONataExpressionBinds): Promise<any>;
}

/**
 * Интерфейс к движку JSONata
 */
export interface IDocHubJSONata {
    /**
     * Регистрирует отладчик в системе
     * @param debug             - Объект реализующий отладчик
     */
    registerDebugger(debug: IDocHubDataLakeDebugger);

    /**
     * Создает объект запроса
     */
    expression(query: JSONataExpression): Promise<IDocHubJSONataQuery>;

    /**
     * Метод временный на период миграции к полной асинхронности
     */
    expressionLocal(query: JSONataExpression): IDocHubJSONataQuery;
}

