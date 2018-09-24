import { IHttpServer } from "../server/httpInterface";
import { DeleteResult } from "typeorm";
import { Request, Response } from "restify";

export interface IController<T> {
    class: string;
    routesMap: Map<string, string>;
    registerRoutes?();
    init (httpServer: IHttpServer);
    ping?(req: Request, res: Response): Promise<T | Object>;
    list?(req: Request, res: Response): Promise<T[] | Array<Object>>;
    getById?(req: Request, res: Response): Promise<T | any>
    create?(req: Request, res: Response): Promise<T | Object>
    update?(req: Request, res: Response): Promise<T | Object>
    deleteById?(req: Request, res: Response): Promise<DeleteResult | Object>
}