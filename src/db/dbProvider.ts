import { Connection, createConnection } from "typeorm";
import { Customer } from "../models/customer";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { DatabaseConfig } from "./configInterface";

export class DatabaseProvider {
    private static connection: Connection;
    private static configuration: DatabaseConfig;

    public static configure(config: DatabaseConfig) {
        this.configuration = Object.assign({}, config);
    }
    public static async getConnection(): Promise<Connection> {
        if (this.connection) {
            return await DatabaseProvider.connection
        }
        const { type, host, port, username, password, database, ssl } = DatabaseProvider.configuration;
        DatabaseProvider.connection = await createConnection({
            type,
            host,
            port,
            username,
            password,
            database,
            extra: {
                ssl
            },
            entities: [Customer],
            synchronize: true // Dev environment only!
        } as MysqlConnectionOptions)

        return await DatabaseProvider.connection;
    }
}