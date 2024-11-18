
/**
 * Интерфейс шаблонизатора Mustache https://mustache.github.io/
 */
export interface IDocHubMustache {
    /**
     * Выполняет генерацию по шаблону
     * @param template      - Шаблон
     * @param data          - Данные для заполнения шаблона
     * @returns             - Результат генерации
     */
    render(template: string, data: any): Promise<string>;
}

/**
 * Интерфейс стандартных утилит облегчающих разработку расширений для DocHub
 */
export interface IDocHubTools {
    /**
     * Шаблонизатора Mustache
     */
    mustache: IDocHubMustache;
}
