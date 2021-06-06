import { Method } from './Routing.ts';

enum RouteArgument {
    ':id' = '(\\w+)',
}

export class Route {
    public method: Method;
    public uri: string;
    public compiled!: string;

    constructor(method: Method, uri: string) {
        this.method = method;
        this.uri = uri;
    }

    public prefix(prefix = ''): this {
        this.uri = prefix + this.uri;

        return this;
    }

    public compile(): this {
        this.compiled = this.uri;

        this.compiled = this.prependLeadingSlash(this.compiled);
        this.compiled = this.trimTrailingSlash(this.compiled);
        this.compiled = `^${this.compiled}\$`;

        for (const [argument, regex] of Object.entries(RouteArgument)) {
            this.compiled = this.compiled.replace(argument, regex);
        }

        return this;
    }

    private prependLeadingSlash(uri: string): string {
        if (!uri.startsWith('/')) {
            uri = '/' + uri;
        }

        return uri;
    }

    private trimTrailingSlash(uri: string): string {
        if (uri.endsWith('/')) {
            uri = uri.slice(0, -1);
        }

        return uri;
    }
}
