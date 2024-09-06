import { IDocHubContext } from "./context";
export interface IDocHubContentProvider {
    bootstrap(context: IDocHubContext);
}