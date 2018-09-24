import { IHttpServer } from "./httpInterface";
import {
    plugins,
    RequestHandler,
    Server,
    Next,
    Request,
    Response
} from "restify";
const restify = require('restify');
import { controllers } from "../controllers";

export class ApiServer implements IHttpServer {
    private server!: Server;
    get(url: string, requestHandler: RequestHandler): void {
        this.handleRequest("get", url, requestHandler);
    }
    post(url: string, requestHandler: RequestHandler): void {
        this.handleRequest("post", url, requestHandler);
    }
    put(url: string, requestHandler: RequestHandler): void {
        this.handleRequest("put", url, requestHandler);
    }
    delete(url: string, requestHandler: RequestHandler): void {
        this.handleRequest("del", url, requestHandler);
    }
    private handleRequest(method: "get" | "post" | "put" | "del", url: string, requestHandler: RequestHandler) {
        this.server[method](url, async (req: Request, res: Response, next: Next) => {
            try {
                await requestHandler(req, res, next)
            } catch (err) {
                console.log(err);
                res.send(500, err);
            }
        })
        console.log(`Request handled for [${method.toUpperCase()}] - ${url}`);
    }
    public start(port: number) {
        const server = restify.createServer();
        this.server = server;
        server.use([
            ...plugins.bodyParser(),
            plugins.queryParser()
        ])
        /** Set CORS */
        this.corsHandler(this.server);
        /** Initialize controllers */
        controllers.forEach(controller => {
            controller.init(this);
            if (controller.registerRoutes) {
                controller.registerRoutes();
            }
        })
        server.listen(port, () => {
            console.log(`Server is up and running in port - ${port}`)
        })
    }
    private corsHandler(server: Server) {
        const corsMiddleware = require('restify-cors-middleware');
        const cors = corsMiddleware({
            preflightMaxAge: 5, // Optional
            origins: [
                'http://localhost',
                'http://*.localhost',
                /^http?:\/\/localhost(:[\d]+)?$/
            ],
            allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowHeaders: [
                'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization',
            ],
            exposeHeaders: ['Authorization']
        });
        server.pre(cors.preflight);
        server.use(cors.actual);
    }
}