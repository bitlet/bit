import { assert, assertEquals } from '../../deps.test.ts';
import { Response } from './Response.ts';

Deno.test({
    name: 'new Response',
    fn() {
        const response = new Response({
            message: 'Hello world',
            status: 201,
            body: {
                hello: 'world',
            },
        });

        assertEquals(response.message, 'Hello world');
        assertEquals(response.status, 201);
        assertEquals(response.body, {
            hello: 'world',
        });
    },
});

Deno.test({
    name: 'response is JSON by default',
    fn() {
        const response = new Response({});

        assert(response.isJson());
    },
});

Deno.test({
    name: 'response as JSON',
    fn() {
        const response = new Response({
            message: 'Hello world',
            status: 201,
            body: {
                hello: 'world',
            },
        });

        assertEquals(response.getAsJson(), '{"message":"Hello world","status":201,"data":{"hello":"world"}}');
    },
});
