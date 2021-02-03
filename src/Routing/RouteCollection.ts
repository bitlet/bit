import { RouteMethod } from './RouteMethod.ts';
import { RouteMiddleware } from './RouteMiddleware.ts';
import { Route } from './Route.ts';

export class RouteCollection {
    protected pre: { [controller: string]: { [method: string]: any } } = {};
    public routes: any = {};

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
    }) {
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
    }

    public compile({ name, route, controller }: { name: string; route: Route; controller: any }) {
        if (this.pre[name]) {
            for (let [key, value] of Object.entries(this.pre[name])) {
                if (!this.routes[value.route.method]) {
                    this.routes[value.route.method] = {};
                }

                const compiledRoute = value.route.compile(route.uri);

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
}
