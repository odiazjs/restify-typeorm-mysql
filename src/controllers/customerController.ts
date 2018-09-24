import { IHttpServer } from "../server/httpInterface";
import { Customer } from "../models/customer";
import { BaseController } from "./baseController";

export class CustomerController extends BaseController<Customer> {
    routesMap: Map<string, string> = new Map();
    constructor() {
        super('Customer');
        this.routesMap.set('ping', '/customers/healthcheck');
        this.routesMap.set('list', '/customers');
        this.routesMap.set('getById', '/customers/:id');
        this.routesMap.set('create', '/customer');
        this.routesMap.set('update', '/customers/:id');
        this.routesMap.set('deleteById', '/customers/:id');
    }
}