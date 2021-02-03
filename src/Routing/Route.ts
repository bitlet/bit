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

    public compile(prefix: string = '') {
        this.compiled = prefix + this.uri;

        this.compiled = this.compiled.replace(/\/$/, '');
        this.compiled = `^${this.compiled}\$`;

        for (const [argument, regex] of Object.entries(RouteArgument)) {
            this.compiled = this.compiled.replace(argument, regex);
        }

        return this;
    }
}
