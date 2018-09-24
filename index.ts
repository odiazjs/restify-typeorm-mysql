import 'reflect-metadata';
import { ApiServer } from './src/server/apiServer'
import { DatabaseProvider } from './src/db/dbProvider';

DatabaseProvider.configure({
    type: 'mysql',
    database: 'typeorm',
    username: 'root',
    password: process.env.PASSWORD as string,
    host: 'localhost',
    port: 3306,
    ssl: false
});

console.log("Password arg is -------------> ", process.env.PASSWORD);
const server = new ApiServer();
server.start(process.env.PORT as any || 3000);