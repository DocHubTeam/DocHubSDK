/**
 * Интерфейс открытого запроса к AI
 */
export interface IDocHubAIRequest {
    /**
     * Обрабатывает ответ от AI
     * @param answer    - Ответ от AI
     */
    onTyping(answer: string): void;
    /**
     * Обрабатывает завершение ответа от AI
     */
    onFinish(): void;
    /**
     * Отменяет запрос
     * @returns 
     */
    cancel?: () => void;
}

/**
 * Тип функции запроса к AI
 */
export type DocHubAskFunction = (question: string, model?: string) => Promise<IDocHubAIRequest>;

/**
 * Интерфейс драйвера AI
 */
export interface IDocHubAIDriver {
    /**
     * 
     */
    isAvailable(): boolean;
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
    registerDriver(model: string, driver: IDocHubAIDriver): void;
    /**
     * Возвращает список доступных моделей AI
     */
    getModels(): string[];
    /**
     * Возвращает дефолтную модель AI
     */
    getDefaultModel(): string;
    /**
     * Устанавливает дефолтную модель AI
     * @param model    - Модель AI
     */
    setDefaultModel(model: string): void;
}
