export enum Format {
    Json = 'application/json',
}

export class Response {
    message: string;
    status: number;
    body: any = {};
    format: string;

    constructor(response: { message?: string; status?: number; body?: any; format?: string }) {
        const { message, status, body, format } = response;

        this.message = message || '';
        this.status = status || 200;
        this.body = body || {};
        this.format = format || Format.Json;
    }

    public isJson() {
        return this.format === Format.Json;
    }

    public getAsJson() {
        return JSON.stringify({
            message: this.message,
            status: this.status,
            data: this.body,
        });
    }
}
