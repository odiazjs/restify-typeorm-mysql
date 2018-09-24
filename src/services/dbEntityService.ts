import { DatabaseProvider } from "../db/dbProvider";
import { DeleteResult } from "typeorm";

export interface IDbEntityService<T> {
    class: string;
    list(): Promise<T[] | Array<any>>;
    getById(id: string): Promise<T | any>
    create(entity: any): Promise<T | any>
    update(entity: any, newEntity: any): Promise<T | any>
    deleteById(id: string): Promise<DeleteResult | any>
}

class DbEntityService<T> {
    class!: string;
    constructor(className: string) {
        this.class = className;
    }
    public async list(): Promise<T[] | Array<Object>> {
        const connection = await DatabaseProvider.getConnection();
        const repo = connection.getRepository<T>(this.class);
        return await repo.find();
    }
    public async getById(id: string): Promise<T | any> {
        const connection = await DatabaseProvider.getConnection();
        const repo = connection.getRepository<T>(this.class);
        return await repo.findOne(id);
    }
    public async create(entity: any): Promise<T | Object> {
        const connection = await DatabaseProvider.getConnection();
        const repo = connection.getRepository<T>(this.class);
        return await repo.save(entity)
    }
    public async update(entity: any, newEntity: any): Promise<T | Object> {
        const connection = await DatabaseProvider.getConnection();
        const repo = connection.getRepository<T>(this.class);
        return await repo.save(Object.assign(entity, newEntity));
    }
    public async deleteById(id: string): Promise<DeleteResult | Object> {
        const connection = await DatabaseProvider.getConnection();
        const repo = connection.getRepository<T>(this.class);
        let toDelete: any = await repo.findOne(id);
        return await repo.delete(toDelete);
    }
}

export const dbEntityServiceFactory = (className: string) => {
    return new DbEntityService(className)
}