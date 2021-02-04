import { Route } from './Route.ts';
import { RouteMethod } from './RouteMethod.ts';
import { RouteMiddleware } from './RouteMiddleware.ts';

export class RouteCollection {
    protected pre: { [controller: string]: { [method: string]: any } } = {};
    public routes: any = {};
    public matchedRoute: any;
    public params: any;

    public add({
        name,
        method,
        route,
        controller,
        middleware,
    }: {
        name: string;
        method: RouteMethod;
        route?: Route;
        controller?: any;
        middleware?: RouteMiddleware;
    }): this {
        let tmp = this.pre;

        if (!tmp[name]) {
            tmp[name] = {};
        }

        tmp = tmp[name];

        if (!tmp[method.name]) {
            tmp[method.name] = {};
        }

        tmp = tmp[method.name];

        if (route) {
            tmp.route = route;
        }

        if (controller) {
            tmp.controller = controller;
        }

        if (method) {
            tmp.method = method;
        }

        if (middleware) {
            if (!tmp.middlewares) {
                tmp.middlewares = {};
            }

            tmp.middlewares[middleware.order] = [];

            tmp.middlewares[middleware.order].push(middleware);
        }

        return this;
    }

    public compile({ name, route, controller }: { name: string; route: Route; controller: any }): void {
        if (this.pre[name]) {
            for (let [key, value] of Object.entries(this.pre[name])) {
                if (!this.routes[value.route.method]) {
                    this.routes[value.route.method] = {};
                }

                const compiledRoute = value.route.prefix(route.uri).compile();

                if (!compiledRoute.compiled) {
                    throw new Error('Route was not compiled');
                }

                this.routes[value.route.method][compiledRoute.compiled] = {
                    route: value.route,
                    controller: controller,
                    method: value.method.name,
                    middlewares: value.middlewares || {
                        before: [],
                        after: [],
                    },
                };
            }
        }
    }

    public match(method: string, uri: string) {
        for (let route in this.routes[method]) {
            const params = uri.match(new RegExp(route));

            if (params) {
                this.params = params;
                this.matchedRoute = this.routes[method][route];

                this.params.shift();

                return true;
            }
        }

        return false;
    }
}
