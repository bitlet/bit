export enum Format {
    Html = 'text/html',
    Json = 'application/json',
    Plain = 'text/plain',
}

export interface ResponseInterface {
    message: string;
    status: number;
    body: string | unknown | unknown[];
    format: string;
}

export class Response {
    public message: string;
    public status: number;
    public body: string | unknown | unknown[] = {};
    public format: string;

    constructor({
        message = '',
        status = 200,
        body = {},
        format = Format.Json,
    }: {
        message?: string;
        status?: number;
        body?: string | unknown | unknown[];
        format?: string;
    }) {
        this.message = message;
        this.status = status;
        this.body = body;
        this.format = format;
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

    public getBodyAsString() {
        return String(this.body);
    }
}
