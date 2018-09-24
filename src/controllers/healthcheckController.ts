import { BaseController, HttpResponse } from "./baseController";

export class HealthCheckController extends BaseController<{}> {
    routesMap: Map<string, string> = new Map();
    constructor () {
        super("HealthCheck")
        this.routesMap.set('ping', '/healthcheck');
        this.routesMap.set('list', '/healthchecks');
        this.routesMap.set('getById', '/healthchecks/:id');
        this.routesMap.set('create', '/healthcheck');
        this.routesMap.set('update', '/healthcheck');
        this.routesMap.set('deleteById', '/healthcheck/:id');
    }
}