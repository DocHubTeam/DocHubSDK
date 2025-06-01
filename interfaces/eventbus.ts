/**
 * Интерфейс внутренней шины событий 
 */
export interface IDocHubEventBus {
    /**
     * Отправляет событие в шину
     * @param event     - Идентификатор события
     * @param data      - Данные события
     */
    $emit(event: string, data?: any);
    /**
     * Монтирует слушателя в шину
     * @param event     - Идентификатор события
     * @param func      - Обработчик события
     */
    $on(event: string, func: Function);
    /**
     * Отмонтирует слушателя от шины
     * @param event     - Идентификатор события
     * @param func      - Обработчик события
     */
    $off(event: string, func: Function);
}
