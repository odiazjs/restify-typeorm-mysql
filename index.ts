import 'reflect-metadata';
import { ApiServer } from './src/server/apiServer'
import { DatabaseProvider } from './src/db/dbProvider';

DatabaseProvider.configure({
    type: 'mysql',
    database: 'typeorm',
    username: 'root',
    password: '{password}',
    host: 'localhost',
    port: 3306,
    ssl: false
});

const server = new ApiServer();
server.start(process.env.PORT as any || 3000);