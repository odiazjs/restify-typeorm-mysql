import { RequestHandler } from "restify";

export interface IHttpServer  {
    get(url: string, requestHandler: RequestHandler): void;
    post(url: string, requestHandler: RequestHandler): void;
    put(url: string, requestHandler: RequestHandler): void;
    delete(url: string, requestHandler: RequestHandler): void;
}