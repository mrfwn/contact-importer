import { Request, Response } from "express";
import { format } from 'date-fns';
import { databaseHealthCheck, HealthStatus } from "./health-io";

const packageJson = require('../../../package.json');

export type HealthResponse = {
    appName: string;
    appVersion: string;
    currentDateTime: string;
    env: string | undefined;
    nodeEnv: string | undefined;
    dbStatus: HealthStatus | null;
    port: string | undefined;
    errors: string[];
    statusCode: number;
};

export default async (_: Request, response: Response) => {

    const dbStatus = await databaseHealthCheck();

    const errors: string[] = [];

    dbStatus.message && errors.push(dbStatus.message);

    const healthResponse: HealthResponse = {
        appName: packageJson.name,
        appVersion: packageJson.version,
        currentDateTime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        env: process.env.ENVIRONMENT,
        nodeEnv: process.env.NODE_ENV,
        dbStatus: dbStatus.status,
        port: process.env.PORT,
        errors,
        statusCode: errors.length === 0 ? 200 : 503
    };

    return response.status(healthResponse.statusCode).json(healthResponse);
};
