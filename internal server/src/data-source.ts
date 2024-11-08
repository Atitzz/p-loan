import "reflect-metadata"
import { DataSource } from "typeorm"
require('dotenv').config();
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: Boolean(Number(process.env?.DB_SYNCHRONIZE || "0")),
    logging: false,
    entities: [`${__dirname}/apps/**/entities/*.{ts,tsx,js}`],
    migrations: [],
    subscribers: [],
})

export const orm = (entityName:any) => AppDataSource.manager.getRepository(entityName);