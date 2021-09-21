export interface Body {
    [key: string]: unknown;
}

export class Request {
    public url;
    public method = 'GET';
    public headers: Headers;
    public body: Body = {};

    constructor({
        url,
        method = 'GET',
        headers,
        body,
    }: {
        url: URL;
        method: string;
        headers: Headers;
        body: Body;
    }) {
        this.url = url;
        this.method = method;
        this.headers = headers;
        this.body = body;
    }
}
