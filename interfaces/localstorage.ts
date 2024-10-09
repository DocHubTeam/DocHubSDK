// Интерфейс локального хранилища.
// Его данные могут быть потеряны в любой момент.

export interface IDocHubLocalStorage {
    // Устанавливает значение для указанного ключа
    setItem(key: string, data: any): Promise<boolean>;
    // Возвращает значение по указанному ключу
    getItem(key: string): Promise<any>;
    // Удаляет ключ и значение
    removeItem(key: string): Promise<boolean>;
}