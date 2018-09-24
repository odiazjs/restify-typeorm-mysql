import { dbEntityServiceFactory, IDbEntityService } from '../services/dbEntityService'
import { IController } from './controllerInterface';
import { Response, Request } from 'restify'
import { IHttpServer } from '../server/httpInterface';
import { HttpCode } from '../../types';

export interface IncomingMessage {
    url: string | undefined;
    userAgent: string | undefined;
}

export class HttpResponse<T> {
    result!: T;
    statusCode!: number;
    statusMessage!: string;
    incomingRequest!: IncomingMessage;
    constructor(result: T, statusCode: number, statusMessage: string, request: Request) {
        this.result = result;
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.incomingRequest = { url: request.url, userAgent: request.headers["user-agent"] };
    }
}

export abstract class BaseController<T> implements IController<T> {
    class: string;
    httpServer!: IHttpServer;
    entitiyService: IDbEntityService<T>
    routesMap: Map<string, string> = new Map();
    constructor(className: string) {
        this.class = className;
        this.entitiyService = dbEntityServiceFactory(className);
    }
    init (httpServer: IHttpServer) {
        this.httpServer = httpServer;
    }
    registerRoutes() {
        this.httpServer.get(this.routesMap.get("ping") as string, this.ping.bind(this))
        this.httpServer.get(this.routesMap.get("list") as string, this.list.bind(this));
        this.httpServer.get(this.routesMap.get("getById") as string, this.getById.bind(this));
        this.httpServer.post(this.routesMap.get("create") as string, this.create.bind(this));
        this.httpServer.put(this.routesMap.get("update") as string, this.update.bind(this));
        this.httpServer.delete(this.routesMap.get("deleteById") as string, this.deleteById.bind(this));
    }
    async ping (req: Request, res: Response) {
        return res.send(HttpCode.OK, new HttpResponse(
            {},
            HttpCode.OK,
            HttpCode[HttpCode.OK],
            req
        ));
    }
    async list(req: Request, res: Response): Promise<T[]> {
        try {
            const result = await this.entitiyService.list();
            const httpCode = result ? HttpCode.OK : HttpCode.NOT_FOUND;
            return res.send(httpCode, new HttpResponse<T[]>(result, httpCode, HttpCode[httpCode], req));
        } catch (err) {
            return res.send(HttpCode.INTERNAL_SERVER_ERROR, new HttpResponse(
                err.sqlMessage, 
                HttpCode.INTERNAL_SERVER_ERROR, 
                err.code, 
                req
            ));
        }
    }
    async getById(req: Request, res: Response): Promise<T> {
        try {
            const result = await this.entitiyService.getById(req.params.id);
            const httpCode = result ? HttpCode.OK : HttpCode.NOT_FOUND;
            return res.send(httpCode, new HttpResponse<T[]>(
                result,
                httpCode,
                HttpCode[httpCode],
                req
            ));
        } catch (err) {
            return res.send(HttpCode.BAD_REQUEST, new HttpResponse(
                err.sqlMessage, 
                HttpCode.INTERNAL_SERVER_ERROR, 
                err.code, 
                req
            ));
        }
    }
    async create(req: Request, res: Response): Promise<T> {
        try {
            const result = await this.entitiyService.create(req.body);
            const httpCode = result ? HttpCode.CREATED : HttpCode.INTERNAL_SERVER_ERROR;
            return res.send(httpCode, new HttpResponse(
                result, 
                httpCode, 
                HttpCode[httpCode], 
                req
            ));
        } catch (err) {
            return res.send(HttpCode.INTERNAL_SERVER_ERROR, new HttpResponse(
                err.sqlMessage, 
                HttpCode.INTERNAL_SERVER_ERROR, 
                err.code, 
                req
            ));
        }
    }
    async update(req: Request, res: Response): Promise<T> {
        try {
            let result;
            let entityToUpdate = await this.entitiyService.getById(req.params.id);
            if (entityToUpdate) {
                result = await this.entitiyService.update(entityToUpdate, req.body);
            }
            const httpCode = entityToUpdate ? HttpCode.OK : HttpCode.NOT_FOUND;
            return res.send(httpCode, new HttpResponse(
                result, 
                httpCode, 
                HttpCode[httpCode], 
                req
            ));
        } catch(err) {
            return res.send(HttpCode.INTERNAL_SERVER_ERROR, new HttpResponse(
                err.sqlMessage, 
                HttpCode.INTERNAL_SERVER_ERROR, 
                err.code, 
                req
            ));
        }
    }
    async deleteById(req: Request, res: Response): Promise<T> {
        try {
            let result;
            const entityToDelete = await this.entitiyService.getById(req.params.id);
            if (entityToDelete) {
                result = await this.entitiyService.deleteById(req.params.id);
            }
            const httpCode = entityToDelete ? HttpCode.OK : HttpCode.NOT_FOUND;
            return res.send(httpCode, new HttpResponse(
                result, 
                httpCode, 
                HttpCode[httpCode], 
                req
            ));
        } catch (err) {
            return res.send(HttpCode.INTERNAL_SERVER_ERROR, new HttpResponse(
                err.sqlMessage, 
                HttpCode.INTERNAL_SERVER_ERROR, 
                err.code, 
                req
            ));
        }
    }
}