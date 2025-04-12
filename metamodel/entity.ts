import { DocHubJSONataQuery } from '../interfaces/jsonata';
import { 
    DocHubJSONSchema
} from '../schemas/basetypes';


export interface IDocHubEntityPresentation {
}

export interface IDocHubEntityPresentations {
    [id: string]: IDocHubEntityPresentation;
}

export interface IDocHubEntityObject {
}

export interface IDocHubEntityObjects {
    [id: string]: IDocHubEntityObject;
}

/**
 * Структура сущностей
 */
export interface IDocHubEntity {
    schema?: DocHubJSONSchema;
    presentations?: IDocHubEntityPresentations;
    objects?: IDocHubEntityObjects;
    menu?: DocHubJSONataQuery;
}