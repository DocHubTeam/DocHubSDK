import { IDocHubContentProviders } from './providers';
import { IDocHubProtocols } from './protocols';
import { IDocHubDocuments } from './documents';
import { IDocHubDataLake } from './datalake';
import { IDocHubConstructors } from './constructors';
import { IDocHubObjects } from './objects';
import { IDocHubUI } from './ui';
import { IDocHubLocalStorage } from './localstorage';
import { IDocHubEventBus } from './eventbus';
import { IDocHubRouter } from './router';
import { IDocHubSettings } from './settings';
import { IDocHubProblems } from './problems';

/**
 * Интерфейс ядра
 */
export interface IDocHubCore {
    /**
     * Интерфейс регистрации возникающих проблем
     */
    problems: IDocHubProblems;
    /**
     * Пользовательские настройки
     */
    settings: IDocHubSettings;
    /**
     *  Интерфейс локального хранилища
     */
    localStore: IDocHubLocalStorage;
    /**
     * Работа с UI роутами
     */
    router: IDocHubRouter;
    /**
     * Провайдеры контента
     */
    contentProviders: IDocHubContentProviders; 
    /**
     * Протоколы доступа к данным
     */
    protocols: IDocHubProtocols;
    /**
     * Документы
     */
    documents: IDocHubDocuments;
    /**
     * Конструкторы объектов
     */
    constructors: IDocHubConstructors;    
    /**
     * UI порт
     */
    ui: IDocHubUI;
    /**
     * Интерфейс к архкоду
     */
    dataLake: IDocHubDataLake;                  
    /**
     * Задекларированные объекты сущностей 
     */
    objects: IDocHubObjects;                   
    /**
     * Внутренняя шина событий
     */
    eventBus: IDocHubEventBus;                 
    /**
     * Версия ядра
     * @returns     - Версия ядра в формате *.*.*
     */
    version(): string;
}