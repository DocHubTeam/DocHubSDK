/**
 *  Интерфейс, который требуется реализовать объектам документов
 */
export interface IDocHubDocument {
    
}

/**
 * Интерфейс управления документами
 */
export interface IDocHubDocuments {
    /**
     * Регистрирует тип документа
     * @param type      - Тип документа. Например "markdown"
     * @param document  - Объект реализующий документ
     */
    register(type: string, document: IDocHubDocument);
    /**
     * Возвращает массив зарегистрированных типов документов 
     * @returns         - Массив зарегистрированных типов документов
     */
    fetch(): string[];
}