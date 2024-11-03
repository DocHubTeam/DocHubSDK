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
import { DocHubEditMode, IDocHubEditors } from './editors';

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
     * Интерфейс взаимодействия с подсистемой редактирования
     */
    editors: IDocHubEditors;
    /**
     * Версия ядра
     * @returns     - Версия ядра в формате *.*.*
     */
    version(): string;
    /**
     * Возвращает текущий режим портала
     */
    getMode(): Promise<DocHubEditMode>;
    /**
     * Пытается перевести портал в запрашиваемый режим.
     * При изменении режима, вызывает событие EditorEvents.modeChanged
     * @param mode      - Режим в который нужно перевести портал
     * @returns         - Режим, в который переведен портал в результате выполнения запроса
     */
    setMode(mode: DocHubEditMode): Promise<DocHubEditMode>;
}