import { IDocHubContext } from './context';
import { IDataLakeChange } from './datalake';
export interface IDocHubContentProvider {
    // Инициализация провайдера
    bootstrap(context: IDocHubContext);
    // Конвертация контента в объекты DataLake
    toObject(content: string): any;
    // Конвертация объектов в контент для хранения
    toContent(data: any): string;
    // Вносит изменения из ченж-лога
    mutation(content: string, changes: IDataLakeChange[]): string;
}