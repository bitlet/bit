// deno-lint-ignore-file no-explicit-any

import { Controller } from '../Controller/Controller.ts';
import { Middleware } from '../Middleware/Middleware.ts';
import { Registry } from '../Registry/Registry.ts';
import { Request } from '../Request/Request.ts';
import { Response } from '../Response/Response.ts';
import { Route as RouteItem } from './Route.ts';
import { RouteCollection } from './RouteCollection.ts';
import { RouteMethod } from './RouteMethod.ts';
import { RouteMiddleware, Order as MiddlewareOrder } from './RouteMiddleware.ts';

export enum Method {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export function Route(uri: string) {
    return function (target: any) {
        Registry.get(Routing).collection.compile({
            name: target.name,
            route: new RouteItem(Method.GET, uri),
            controller: target,
        });
    };
}

export function Before(middleware: Middleware | any) {
    return function (target: Controller, method: string, descriptor: PropertyDescriptor) {
        Registry.get(Routing).collection.add({
            name: target.constructor.name,
            method: new RouteMethod(method, descriptor),
            middleware: new RouteMiddleware(middleware.name, middleware, MiddlewareOrder.Before),
        });
    };
}

export function After(middleware: Middleware | any) {
    return function (target: any, method: string, descriptor: PropertyDescriptor) {
        Registry.get(Routing).collection.add({
            name: target.constructor.name,
            method: new RouteMethod(method, descriptor),
            middleware: new RouteMiddleware(middleware.name, middleware, MiddlewareOrder.After),
        });
    };
}

export function Any(uri: string) {
    return function (target: Controller, method: string, descriptor: PropertyDescriptor) {
        Registry.get(Routing).collection.add({
            name: target.constructor.name,
            route: new RouteItem(Method.GET, uri),
            method: new RouteMethod(method, descriptor),
        });

        Registry.get(Routing).collection.add({
            name: target.constructor.name,
            route: new RouteItem(Method.POST, uri),
            method: new RouteMethod(method, descriptor),
        });

        Registry.get(Routing).collection.add({
            name: target.constructor.name,
            route: new RouteItem(Method.PUT, uri),
            method: new RouteMethod(method, descriptor),
        });

        Registry.get(Routing).collection.add({
            name: target.constructor.name,
            route: new RouteItem(Method.PATCH, uri),
            method: new RouteMethod(method, descriptor),
        });

        Registry.get(Routing).collection.add({
            name: target.constructor.name,
            route: new RouteItem(Method.DELETE, uri),
            method: new RouteMethod(method, descriptor),
        });
    };
}

export function Get(uri: string) {
    return function (target: Controller, method: string, descriptor: PropertyDescriptor) {
        Registry.get(Routing).collection.add({
            name: target.constructor.name,
            route: new RouteItem(Method.GET, uri),
            method: new RouteMethod(method, descriptor),
        });
    };
}

export function Post(uri: string) {
    return function (target: Controller, method: string, descriptor: PropertyDescriptor) {
        Registry.get(Routing).collection.add({
            name: target.constructor.name,
            route: new RouteItem(Method.POST, uri),
            method: new RouteMethod(method, descriptor),
        });
    };
}

export function Put(uri: string) {
    return function (target: Controller, method: string, descriptor: PropertyDescriptor) {
        Registry.get(Routing).collection.add({
            name: target.constructor.name,
            route: new RouteItem(Method.PUT, uri),
            method: new RouteMethod(method, descriptor),
        });
    };
}

export function Patch(uri: string) {
    return function (target: Controller, method: string, descriptor: PropertyDescriptor) {
        Registry.get(Routing).collection.add({
            name: target.constructor.name,
            route: new RouteItem(Method.PATCH, uri),
            method: new RouteMethod(method, descriptor),
        });
    };
}

export function Delete(uri: string) {
    return function (target: Controller, method: string, descriptor: PropertyDescriptor) {
        Registry.get(Routing).collection.add({
            name: target.constructor.name,
            route: new RouteItem(Method.DELETE, uri),
            method: new RouteMethod(method, descriptor),
        });
    };
}

export class Routing {
    public collection: RouteCollection;
    protected matchedRoute: any;

    constructor() {
        this.collection = new RouteCollection();
    }

    public async matchUri(request: Request): Promise<Response> {
        let response: Response = new Response({
            message: 'Route not found',
            status: 404,
        });

        if (this.collection.match(request.method, request.url.pathname)) {
            this.matchedRoute = this.collection.matchedRoute;
            const controller = new this.matchedRoute.controller();

            if (this.matchedRoute.middlewares.before) {
                const middlewareResponse = await this.before(controller);

                if (middlewareResponse) {
                    return middlewareResponse;
                }
            }

            response = await controller[this.matchedRoute.method](this.collection.params);

            if (this.matchedRoute.middlewares.after) {
                const middlewareResponse = await this.after(controller);

                if (middlewareResponse) {
                    return middlewareResponse;
                }
            }
        }

        return response;
    }

    private async before(controller: any): Promise<void | Response> {
        for (const middleware of this.matchedRoute.middlewares.before) {
            return await new middleware.callback(controller).execute();
        }
    }

    private async after(controller: any): Promise<void | Response> {
        for (const middleware of this.matchedRoute.middlewares.after) {
            return await new middleware.callback(controller).execute();
        }
    }
}
