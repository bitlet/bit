import { assertEquals } from '../../deps.test.ts';
import { Registry } from './Registry.ts';

class Hello {
    hello: string = '';

    constructor(hello: string) {
        this.hello = hello;
    }
}

class World {
    world: string = '';

    constructor(world: string) {
        this.world = world;
    }
}

Deno.test({
    name: 'new Registry with multiple register()',
    async fn() {
        new Registry().register(new Hello('hello')).register(new World('world'));

        assertEquals(Registry.get(Hello).hello, 'hello');
        assertEquals(Registry.get(World).world, 'world');

        Registry.clear();
    },
});

Deno.test({
    name: 'new Registry with multiple registerMany()',
    async fn() {
        new Registry().registerMany([new Hello('hello')]).registerMany([new World('world')]);

        assertEquals(Registry.get(Hello).hello, 'hello');
        assertEquals(Registry.get(World).world, 'world');

        Registry.clear();
    },
});
