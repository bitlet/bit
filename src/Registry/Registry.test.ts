import { assertEquals } from '../../deps.test.ts';
import { Registry } from './Registry.ts';

class Hello {
    hello = '';

    constructor(hello: string) {
        this.hello = hello;
    }
}

class World {
    world = '';

    constructor(world: string) {
        this.world = world;
    }
}

Deno.test({
    name: 'new Registry with multiple register() calls',
    fn() {
        new Registry().register(new Hello('hello')).register(new World('world'));

        assertEquals(Registry.get(Hello).hello, 'hello');
        assertEquals(Registry.get(World).world, 'world');

        Registry.clear();
    },
});

Deno.test({
    name: 'new Registry with multiple instances inside register',
    fn() {
        new Registry().register(new Hello('hello'), new World('world'));

        assertEquals(Registry.get(Hello).hello, 'hello');
        assertEquals(Registry.get(World).world, 'world');

        Registry.clear();
    },
});
