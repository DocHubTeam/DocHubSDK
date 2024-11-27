/**
 * Класс внутренних ошибок DocHub
 */
export class DocHubError extends Error {
    constructor(...params) {
      super(...params);
    }
}