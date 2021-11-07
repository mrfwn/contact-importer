require('dotenv').config();
import { join } from "path";
const { NODE_ENV: TEST } = process.env;
export const ENVIRONMENT = process.env.ENVIRONMENT;
export const NODE_ENV = process.env.NODE_ENV;
export const POSTGRES_USER = TEST !== 'test' ? process.env.POSTGRES_USER : 'postgres';
export const POSTGRES_HOST = TEST !== 'test' ? process.env.POSTGRES_HOST : 'localhost';
export const POSTGRES_DATABASE = TEST !== 'test' ? process.env.POSTGRES_DATABASE : 'contact_db';
export const POSTGRES_PASSWORD = TEST !== 'test' ? process.env.POSTGRES_PASSWORD : 'postgres';
export const POSTGRES_PORT = TEST !== 'test' ? process.env.POSTGRES_PORT : '5432';
export const POSTGRES_SSL = TEST !== 'test' ? process.env.POSTGRES_SSL : 'false';
export const APP_NAME = process.env.APP_NAME;
export const PORT = process.env.PORT;
export const IS_DEV = process.env.NODE_ENV === "dev";
export const IS_TEST = process.env.NODE_ENV === "test";

export const API_ROOT = IS_DEV || IS_TEST ? join(process.cwd(), "src") : join(process.cwd(), "dist");