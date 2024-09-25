import { IDocHubContext } from './contexts';
import { IDataLakeChange } from './datalake';
export interface IDocHubContentProvider {
    // Флаг активности провайдера
    isActive(): boolean; 
    // Инициализация провайдера
    bootstrap(context: IDocHubContext);
    // Конвертация контента в объекты DataLake
    toObject(content: any): any;
    // Конвертация объектов в контент для хранения
    toContent(data: any): any;
    // Вносит изменения из ченж-лога
    mutation(content: string, changes: IDataLakeChange[]): string;
}