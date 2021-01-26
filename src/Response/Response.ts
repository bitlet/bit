export enum Format {
    Json = 'application/json',
}

export class Response {
    message: string;
    status: number;
    body: any = {};
    format: string;

    constructor({
        message = '',
        status = 200,
        body = {},
        format = Format.Json,
    }: {
        message?: string;
        status?: number;
        body?: any;
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
}
