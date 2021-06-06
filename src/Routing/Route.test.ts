import { Method } from './Routing.ts';
import { Route } from './Route.ts';
import { assertEquals } from '../../deps.test.ts';

Deno.test({
    name: 'Route with basic compilation',
    fn() {
        let route = null;

        route = new Route(Method.GET, '/');
        assertEquals(route.compile().compiled, '^$');

        route = new Route(Method.GET, '/hello/:id');
        assertEquals(route.compile().compiled, '^/hello/(\\w+)$');

        route = new Route(Method.GET, '/hello/:id/');
        assertEquals(route.compile().compiled, '^/hello/(\\w+)$');
    },
});

Deno.test({
    name: 'Route with compilation and trailing slash',
    fn() {
        const route = new Route(Method.GET, '/hello/:id/');
        assertEquals(route.compile().compiled, '^/hello/(\\w+)$');
    },
});

Deno.test({
    name: 'Route with compilation without leading slash',
    fn() {
        const route = new Route(Method.GET, 'hello/:id/');
        assertEquals(route.compile().compiled, '^/hello/(\\w+)$');
    },
});

Deno.test({
    name: 'Route with compilation and prefix',
    fn() {
        const route = new Route(Method.GET, '/hello/:id/');
        assertEquals(route.prefix('world').compile().compiled, '^/world/hello/(\\w+)$');
    },
});
