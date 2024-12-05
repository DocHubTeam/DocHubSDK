import { DocHub } from '..';
import { DataLakePath } from '../interfaces/datalake';
import { IDocHubProblem } from '../interfaces/problems';
/**
 * Класс внутренних ошибок DocHub
 */
export class DocHubError extends Error {
    constructor(...params) {
      super(...params);
    }
}
/**
 * Класс ошибок, являющихся проблемами для разрешения пользователем
 */
export class DocHubErrorProblem extends DocHubError implements IDocHubProblem {
  uid: string;
  title: string;
  description: string;
  location?: string | undefined;
  path?: DataLakePath | DataLakePath[] | undefined;
  correction?: string | undefined;
  constructor(data: IDocHubProblem) {
    super(`Registered problem [${data.uid}]: ${data.title}`, { cause: data });
    this.uid = data.uid;
    this.title = data.uid;
    this.description = data.description;
    this.location = data.location;
    this.path = data.path;
    this.correction = data.correction;
    DocHub.problems.emit(this);
  }
}