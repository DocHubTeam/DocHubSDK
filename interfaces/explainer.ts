
/**
 * Интерфейс драйвера объяснения
 */
export interface IDocHubExplainerDriver {
    /**
     * Возвращает признак активности драйвера
     */
    isActive(): boolean;
    /**
     * Объясняет файл
     * @param uri               - URI файла
     * @returns                 - Результат выполнения запроса
     */
    explainFile(uri: string): Promise<string>;
    /**
     * Объясняет метаданные
     * @param path              - Путь который требуется объяснить
     * @returns                 - Результат выполнения запроса
     */
    explainMeta(path: string): Promise<string>;
    /**
     * Объясняет данные
     * @param data              - Данные
     * @returns                 - Результат выполнения запроса
     */
    explainData(data: any): Promise<string>;
}

/**
 * Интерфейс подсистемы объяснения
 */
export interface IDocHubExplainer {
    /**
     * Ожидает готовности к запросам в подсистему объяснения
     * @param immediately    - Если true, то функция не ожидает готовности запросам, а генерирует ошибку
     */
    whenReady(immediately?:boolean): Promise<void>;    
    /**
     * Регистрирует драйвер
     * @param driver            - Драйвер
     */
    registerDriver(alias: string, driver: IDocHubExplainerDriver): void;
    /**
     * Возвращает список доступных драйверов
     * @returns                 - Список доступных драйверов
     */
    getDrivers(): string[];
    /**
     * Объясняет файл
     * @param uri               - URI файла
     * @param driver            - Драйвер
     * @returns                 - Результат выполнения запроса
     */
    explainFile(uri: string, driver?: string): Promise<string>;
    /**
     * Объясняет метаданные
     * @param path              - Путь который требуется объяснить
     * @param driver            - Драйвер
     * @returns                 - Результат выполнения запроса
     */
    explainMeta(path: string, driver?: string): Promise<string>;
    /**
     * Объясняет данные
     * @param data              - Данные
     * @param driver            - Драйвер
     * @returns                 - Результат выполнения запроса
     */
    explainData(data: any, driver?: string): Promise<string>;
    /**
     * Возвращает дефолтный драйвер
     */
    getDefaultDriver(): string;
    /**
     * Устанавливает дефолтный драйвер
     * @param driver    - Драйвер
     */
    setDefaultDriver(alias: string): void;
}
