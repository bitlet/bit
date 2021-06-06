import { assertEquals } from '../../deps.test.ts';
import { Env } from './Env.ts';

Deno.test({
    name: 'new Env',
    fn() {
        const env = new Env({
            hello: 'world',
            hello2: 'world2',
        });

        assertEquals(env.get().hello, 'world');
        assertEquals(env.get().hello2, 'world2');

        assertEquals(env.get(), {
            hello: 'world',
            hello2: 'world2',
        });
    },
});
