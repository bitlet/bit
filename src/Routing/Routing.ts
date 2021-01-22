import { Route } from './Route.ts';
import { Controller } from '../Controllers/Interfaces/Controller.ts';
import { Response } from '../Response/Response.ts';

enum Method {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

enum RouteArguments {
    ':id' = '(\\w+)',
}

export function Controller(uri: string) {
    return function (constructor: Function) {
        Routing.addController(constructor.name, uri);
    };
}

export function Any(uri: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        Routing.addUri(Method.GET, uri, target, descriptor);
        Routing.addUri(Method.POST, uri, target, descriptor);
        Routing.addUri(Method.PUT, uri, target, descriptor);
        Routing.addUri(Method.PATCH, uri, target, descriptor);
        Routing.addUri(Method.DELETE, uri, target, descriptor);
    };
}

export function Get(uri: string) {
    return function (target: Controller, key: string, descriptor: PropertyDescriptor) {
        Routing.addUri(Method.GET, uri, target, descriptor);
    };
}

export function Post(uri: string) {
    return function (target: Controller, key: string, descriptor: PropertyDescriptor) {
        Routing.addUri(Method.POST, uri, target, descriptor);
    };
}

export function Put(uri: string) {
    return function (target: Controller, key: string, descriptor: PropertyDescriptor) {
        Routing.addUri(Method.PUT, uri, target, descriptor);
    };
}

export function Patch(uri: string) {
    return function (target: Controller, key: string, descriptor: PropertyDescriptor) {
        Routing.addUri(Method.PATCH, uri, target, descriptor);
    };
}

export function Delete(uri: string) {
    return function (target: Controller, key: string, descriptor: PropertyDescriptor) {
        Routing.addUri(Method.DELETE, uri, target, descriptor);
    };
}

export class Routing {
    protected static controllers: { [controller: string]: { [requestMethod: string]: { [uri: string]: Route } } } = {};

    protected static routes: { [requestMethod: string]: { [uri: string]: Route } } = {
        GET: {},
        POST: {},
        PUT: {},
        PATCH: {},
        DELETE: {},
    };

    protected static matchedRoute: any;

    public static addController(controller: string, prefixUri: string) {
        for (const [requestMethod, uris] of Object.entries(this.controllers[controller])) {
            for (let [uri, route] of Object.entries(uris)) {
                uri = prefixUri + uri;
                uri = uri.replace(/\/$/, '');
                uri = `^${uri}\$`;

                for (const [argument, regex] of Object.entries(RouteArguments)) {
                    uri = uri.replace(argument, regex);
                }

                this.routes[requestMethod][uri] = route;
            }
        }
    }

    public static addUri(requestMethod: Method, uri: string, controller: any, method: PropertyDescriptor) {
        const controllerName: string = controller.constructor.name;

        if (!this.controllers[controllerName]) {
            this.controllers[controllerName] = {};
        }

        if (!this.controllers[controllerName][requestMethod]) {
            this.controllers[controllerName][requestMethod] = {};
        }

        this.controllers[controllerName][requestMethod][uri] = new Route(controller, method);
    }

    public controllers() {
        return this.controllers;
    }

    public routes() {
        return this.routes;
    }

    public static async matchUri(requestMethod: string, uri: string) {
        let response: Response = new Response({
            message: 'Route not found',
            status: 404,
        });

        for (let route in this.routes[requestMethod]) {
            const params = uri.match(new RegExp(route));

            if (params) {
                this.matchedRoute = this.routes[requestMethod][route];

                params.shift();

                response = await this.matchedRoute.method.value.apply(this.matchedRoute.controller, params);

                break;
            }
        }

        return response;
    }
}
