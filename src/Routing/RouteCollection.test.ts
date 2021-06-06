import { Method } from './Routing.ts';
import { Route } from './Route.ts';
import { RouteCollection } from './RouteCollection.ts';
import { RouteMethod } from './RouteMethod.ts';
import { RouteMiddleware, Order } from './RouteMiddleware.ts';
import { assertEquals } from '../../deps.test.ts';

const collection = new RouteCollection().add({
    name: 'DefaultController',
    method: new RouteMethod('index', () => {}),
    route: new Route(Method.GET, '/world'),
    controller: new Object(),
    middleware: new RouteMiddleware('SomeMiddleware', () => {}, Order.Before),
});

collection.compile({
    name: 'DefaultController',
    route: new Route(Method.GET, 'hello'),
    controller: new Object(),
});

Deno.test({
    name: 'new RouteCollection()',
    fn() {
        assertEquals(
            JSON.stringify(collection.routes),
            '{"GET":{"^/hello/world$":{"route":{"method":"GET","uri":"hello/world","compiled":"^/hello/world$"},"controller":{},"method":"index","middlewares":{"before":[{"order":"before","name":"SomeMiddleware"}]}}}}',
        );
    },
});

Deno.test({
    name: 'new RouteCollection() testing match',
    fn() {
        const match = collection.match(Method.GET, '/hello/world');

        assertEquals(match, true);
        assertEquals(collection.matchedRoute.route.compiled, '^/hello/world$');
    },
});
