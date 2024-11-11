export type DocHubCollaborationInvite = string;

export type DocHubCollaborationChannel = string;
export type DocHubCollaborationEvent = string | RegExp;
export type DocHubCollaborationChannelHandler = (channel: DocHubCollaborationChannel) => void;

/**
 *  Транспортный драйвер коллаборации
 */
export interface IDocHubCollaborationDriver {

}

/**
 *  Сессия коллаборации
 */
export interface IDocHubCollaborationSession {

}

/**
 *  Интерфейс реализующий коллаборативную работу групп
 */
export interface IDocHubCollaboration {
    /**
     *  Признак доступности режима коллаборации
     *  @returns        - true если режим коллаборации доступен, иначе false
     */
    isAvailable(): Promise<boolean>;

    /**
     * Регистрирует коллаборативный драйвер. Возможен только один.
     * Если драйвер уже зарегистрирован, метод должен генерировать ошибку.
     * @param driver        - Драйвер
     */
    registerDriver(driver: IDocHubCollaborationDriver): Promise<void>;

    /**
     * Создает коллаборативную сессию
     * @returns         - Открытая сессия
     */
    createSession(): Promise<IDocHubCollaborationSession>;

    /**
     * Возвращает текущую сессию, если она открыта
     * @returns         - Текущая сессия или null
     */
    getSession(): Promise<IDocHubCollaborationSession | null>;

    /**
     * Покинуть коллаборативную сессию
     */
    liveSession(): Promise<void>;

    /**
     * Создает приглашение в виде URL для подключения к сессии
     * @requires        - Инвайт в виде URL
     */
    makeInvite(): Promise<DocHubCollaborationInvite>;

    /**
     * Осуществляет вход по приглашению
     * @requires        - Инвайт в виде URL
     */
    enter(invite: DocHubCollaborationInvite): Promise<IDocHubCollaborationSession>;

    /**
     * Осуществляет подписку на канал и события
     * @param channel   - Канал, который будет слушать подписчик 
     * @param events    - События, которые подписчик собирается обрабатывать
     * @param handler   - Обработчик событий
     */
    subscribe(channel: DocHubCollaborationChannel, events: DocHubCollaborationEvent[], handler: DocHubCollaborationChannelHandler);

    /**
     * Отписывает слушателя
     * @param channel   - Канал, от которого описывается слушатель
     * @param events    - События, от которых описывается слушатель
     * @param handler   - Обработчик событий
     */
    unsubscribe(channel: DocHubCollaborationChannel, events: DocHubCollaborationEvent[], handler: DocHubCollaborationChannelHandler);

    /**
     * Отсылает сообщение в канал
     * @param channel   - Канал
     * @param event     - Событие
     * @param data      - Данные для обработки
     */
    sendEvent(channel: DocHubCollaborationChannel, event: DocHubCollaborationEvent, data: any): Promise<void>;
}