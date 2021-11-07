import { Response, Request, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ENVIRONMENT } from '../config/env';

type BodyResponse = {
    status: boolean;
    data: Object;
    message: string;
    errorId?: string;
};

type LogAdditionalData = {
    method: string;
    path: string;
    request_body: string;
    response_body: BodyResponse;
    status: number | string;
    environment: string;
    errorId: string;
};

export class ValidationError extends Error {
    public status: number;
    public data: string[];
    constructor(message: string, data?: string[]) {
        super(message);
        this.data = data || [];
        this.name = 'ValidationError';
        this.message = message;
        this.status = 400;
    }
}

export class DatabaseError extends Error {
    public status: number;
    public data: string[];
    constructor(message: string, data?: string[]) {
        super(message);
        this.data = data || [];
        this.name = 'DatabaseError';
        this.message = message;
        this.status = 404;
    }
}


export class IntegrationError extends Error {
    public status: number;
    public data: string[];
    constructor(message: string, data?: string[]) {
        super(message);
        this.data = data || [];
        this.name = 'IntegrationError';
        this.message = message;
        this.status = 500;
    }
}

export type GeneralError = ValidationError | DatabaseError | IntegrationError;

export const middlewareError = (err: GeneralError, req: Request, res: Response, _: NextFunction) => {
    const environment = ENVIRONMENT || 'local';
    const body: BodyResponse = {
        status: false,
        data: err.data,
        message: err.message
    };

    if (environment !== 'local') {
        const errorId: string = uuidv4();

        const requestData: LogAdditionalData = {
            method: req.method,
            path: req.originalUrl,
            request_body: req.body,
            response_body: body,
            status: err?.status ?? 'CODE ERROR',
            environment: environment,
            errorId
        };

        const tags: string[] = [environment, req.originalUrl];
        if (err?.status >= 400 && err?.status <= 499) {
            console.log(`Request on ${req.originalUrl} returned status code ${err.status}`, requestData, tags);
        } else if (err?.status >= 500 && err?.status <= 599) {
            console.error(`Request on ${req.originalUrl} returned status code ${err.status}`, requestData, tags);
        } else {
            requestData.response_body.message = err.stack ?? err.message;
            console.error(`Request on ${req.originalUrl} contains code errors`, requestData, tags);
            err.status = 500;
            body.message = err.message ?? 'Internal server error';
        }
        console.log(err);
        return res.status(err.status).json({ ...body, errorId });
    } else {
        console.log(err);
        const finalStatus = err.status ? err.status : 500;
        return res.status(finalStatus).json({ status: 'error', message: err.stack ?? err.message });
    }
};
