import { description } from '@front/lang/en/validators';
import { DocHubJSONSchema } from '../schemas/basetypes';
import { DataLakePath } from './datalake';
import { DocHubEditorContext } from './editors';

/**
 * События AI 
 */
export enum DocHubAIEvents {
    /**
     * Глобальные события
     */
    setDefaultDriver = '$ai-change-default-driver',  // Драйвер AI по умолчанию изменился
    /**
     * Локальные события
     */
    registeredDriver = '#ai-registered-driver',  // Зарегистрирован драйвер AI
};

/**
 * Фрагмент контекста
 */
export interface IDocHubAIContextPortion {}

/**
 * Интерфейс открытого запроса к AI
 */
export interface IDocHubAIRequest {
    /**
     * Возвращает локальный контекст
     */
    getLocalContext?: () => Promise<string>
    /**
     * Возвращает локальный промпт
     */
    getLocalPrompt?: () => Promise<string>
    /**
     * Обрабатывает ответ от AI
     * @param answer    - Ответ от AI
     */
    onTyping?: (answer: string) => void;
    /**
     * Обрабатывает завершение ответа от AI
     */
    onFinish?: () => void;
    /**
     * Обрабатывает ошибку
     * @param error    - Ошибка
     */
    onError?: (error: Error) => void;
    /**
     * Очищает накопившийся контекст
     */
    clearContext();
    /**
     * Отменяет запрос
     * @returns 
     */
    cancel();
    /**
     * Отправляет следующий запрос в AI
     * @returns 
     */
    next(question: string): Promise<void>;
}

export type DocHubAIAskAttachmentFileContent = string;


/**
 * Метаданные файла
 */
export interface DocHubAIAskAttachmentFile {
    url: URL;               // Ссылка на файл, либо base64 кодированный файл
    source?: URL;           // Источник информации для задач AI при указании ссылок на источники
    description?: string;   // Контекстное описание файла
}

/**
 * Структура прикрепляемых файлов к запросу
 */

export type DocHubAIAskAttachment = DocHubAIAskAttachmentFile[];

/**
 * Опции выполнения AI запроса
 */
export interface IDocHubAIAskOptions {
    /**
     * Драйвер AI-агента, который нужно использовать для выполнения запроса
     */
    driver?: string;
    /**
     * AI-модель, которую нужно использовать для выполнения запроса
     */
    model?: string;
    /**
     * Признак отображения внутреннего диалога IDE и AI-агента
     */
    trace?: boolean;
    /**
     * Файлы прикрепляемые к запросу
     */
    attachment?: DocHubAIAskAttachment;
}

/**
 * Тип функции запроса к AI
 */
export type DocHubAskFunction = (question: string, options?: IDocHubAIAskOptions) => Promise<IDocHubAIRequest>;

/**
 * Интерфейс драйвера AI
 */
export interface IDocHubAIDriver {
    /**
     * Возвращает признак активности драйвера
     */
    isActive(): boolean;
    /**
     * Задает вопрос AI
     * @param question    - Вопрос
     * @param model       - Модель AI
     * @returns           - Запрос к AI
    */
    ask: DocHubAskFunction;
    /**
     * Возвращает информацию о способностях AI
     */
    getCapabilities(): Promise<IDocHubAICapabilities>;
}

export interface IDocHubAITextPartition {
    /**
     * Уникальный идентификатор сегмента контекста
     */
    id: string;
    /**
     * URI источника контекста, если актуально
     */
    uri?: string;
    /**
     * Источник в DataLake, если актуально
     */
    path?: DataLakePath;
    /**
     * Название сегмента
     */
    title?: string;
    /**
     * Краткое описание сути сегмента
     */
    description?: string;
    /**
     * Функция генерации контента
     */
    content: () => Promise<string>;
}

/**
 * Интерфейс сегмента AI контекста
 */
export type IDocHubAIContextPartition = IDocHubAITextPartition;

/**
 * Интерфейс провайдера AI контекстов
 */
export interface IDocHubContextProvider {
    pullPartitions(): Promise<IDocHubAIContextPartition[]>;
}

/**
 * Интерфейс сегмента AI контекста
 */
export type IDocHubAIKnowledgeItem = IDocHubAITextPartition;

/**
 * Интерфейс провайдера AI знаний
 */
export interface IDocHubKnowledgeProvider {
    pullItems(): Promise<IDocHubAIKnowledgeItem[]>;
}

export type IDocHubAIComposerCommandPayload = any;

export interface IDocHubAIComposerCommandMeta {
    /**
     * Уникальный идентификатор команды
     */
    id: string;
    /**
     * Схема определяющая payload команды
     */
    schema: DocHubJSONSchema;
}

/**
 * Метаинформация о доступных знаниях 
 */
export interface IDocHubAIComposerKnowledgeMeta {
    /**
     * Уникальный идентификатор знания
     */
    id: string;
    /**
     * Краткое описание сути знания
     */
    description: string;
}

/**
 * Интерфейс декларирующий доступную команду для AI
 */
export interface IDocHubAIComposerCommand extends IDocHubAIComposerCommandMeta {
    /**
     * Метод исполнения команды
     * @param payload   - Данны для выполнения команды
     * @returns         - Результат выполнения команды для включения в контекст
     */
    execute(payload: IDocHubAIComposerCommandPayload): Promise<string>;
}

/**
 * Интерфейс провайдера AI composer
 */
export interface IDocHubComposerProvider {
    fetchCommands(): Promise<IDocHubAIComposerCommand[]>;
}

export enum DocHubAICapabilityID {
    text = 'text',
    attachment = 'attachment',
    contextWindow = 'context-window'
}

export type DocHubAIAttachmentFileContentType = string;

/**
 * Метаинформация о возможностях AI-агента
 */
export interface IDocHubAICapabilities {
    /**
     * Текстовое резюме от AI
     */
    description?: string;
    /**
     * Способность обрабатывать прикрепленные файлы к сообщению
     */
    [DocHubAICapabilityID.attachment]?: DocHubAIAttachmentFileContentType[];
    /**
     * Способность воспринимать текс в запросе
     */
    [DocHubAICapabilityID.text]?: boolean;
    /**
     * Размер контекстного окна
     */
    [DocHubAICapabilityID.contextWindow]?: number;
}


/**
 * Интерфейс AI ассистента
 */
export interface IDocHubAI {
    /**
     * Ожидает готовности AI к запросам
     * @param immediately    - Если true, то функция не ожидает готовности AI к запросам, а генерирует ошибку
     */
    whenReady(immediately?:boolean): Promise<void>;
    /**
     * Задает вопрос AI
     * @param question    - Вопрос
     * @param model       - Модель AI
     * @returns           - Запрос к AI
    */
    ask: DocHubAskFunction;
    /**
     * Создает глобальный контекст на основании встроенных механизмов
     * @param context   - Пользовательский контекст. Если не указан, то будет использован текущий контекст
     * @returns         - Глобальный контекст
     */
    makeGlobalContext(context?: DocHubEditorContext): Promise<string>;
    /**
     * Исполняет команду композера
     * @param commandId - Идентификатор команды
     * @param payload   - Данные передающиеся для исполнения команды
     * @returns         - Результат исполнения команды, который станет частью контекста
     */
    execComposerCommand(commandId: string, payload: IDocHubAIComposerCommandPayload): Promise<string>;
    /**
     * Возвращает все зарегистрированные команды композера
     */
    fetchComposerCommands(): Promise<IDocHubAIComposerCommandMeta[]>;
    /**
     * Возвращает все модули знаний
     */
    fetchKnowledge(): Promise<IDocHubAIComposerKnowledgeMeta[]>;
    /**
     * Регистрирует драйвер AI
     * @param alias     - Алиас драйвера
     * @param driver    - Драйвер AI
     */
    registerDriver(alias: string, driver: IDocHubAIDriver): void;
    /**
     * Регистрирует провайдера AI-контекстов
     * @param alias     - Алиас провайдера
     * @param provider  - Драйвер контекста
     */
    registerContextProvider(alias: string, provider: IDocHubContextProvider): void;
    /**
     * Регистрирует провайдера AI-знаний
     * @param alias     - Алиас провайдера
     * @param provider  - Драйвер контекста
     */
    registerKnowledgeProvider(alias: string, provider: IDocHubKnowledgeProvider): void;
    /**
     * Возвращает массив запрашиваемых знаний
     * @param ids       - Идентификаторы знаний
     */
    pullKnowledge(ids: string[]): Promise<string[]>;
    /**
     * Регистрирует провайдера команд доступных для AI
     * @param alias     - Алиас провайдера
     * @param provider  - Драйвер контекста
     */
    registerComposerProvider(alias: string, provider: IDocHubComposerProvider): void;
    /**
     * Возвращает список доступных AI драйверов
     */
    fetchDrivers(): string[];
    /**
     * Возвращает интерфейс драйвера по указанному идентификатору.
     * Если alias пусто, то вернет интерфейс к драйверу по умолчанию.
     */
    getDriver(alias?: string): IDocHubAIDriver;
    /**
     * Возвращает дефолтный драйвер AI
     */
    getDefaultDriver(): string;
    /**
     * Устанавливает дефолтный драйвер AI
     * @param driver    - Драйвер AI
     */
    setDefaultDriver(alias: string): void;
}
