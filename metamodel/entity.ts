import { DocHubJSONataQuery } from '../interfaces/datasets';
import { 
    IDocHubSchema,
    BaseTypes,
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
    schema?: IDocHubSchema;
    presentations?: IDocHubEntityPresentations;
    objects?: IDocHubEntityObjects;
    menu?: DocHubJSONataQuery;
}