import { db } from "../database/db-connection";

export enum HealthStatus {
    Online = 'online',
    Offline = 'offline'
};

export type HealthCheckResponse = {
    status: HealthStatus,
    message: string | null;
};

export const databaseHealthCheck = async (): Promise<HealthCheckResponse> => {
    try {
        const { rows } = await db.query(`SELECT now();`);

        const response: HealthCheckResponse = { status: HealthStatus.Online, message: null }

        return (rows.length > 0 && rows !== undefined) ? response : {} as HealthCheckResponse

    } catch (error) {
        return {
            status: HealthStatus.Offline,
            message: `Database Error: ${error.message}`
        }
    }
};