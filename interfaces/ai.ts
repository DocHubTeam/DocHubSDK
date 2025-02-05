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
     * Отменяет запрос
     * @returns 
     */
    cancel();
}

/**
 * Тип функции запроса к AI
 */
export type DocHubAskFunction = (question: string, driver?: string, model?: string) => Promise<IDocHubAIRequest>;

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
     * Регистрирует драйвер AI
     * @param alias     - Алиас драйвера
     * @param driver    - Драйвер AI
     */
    registerDriver(alias: string, driver: IDocHubAIDriver): void;
    /**
     * Возвращает список доступных моделей AI
     */
    getDrivers(): string[];
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
