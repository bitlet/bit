import { assertEquals } from '../../deps.test.ts';
import { Config } from './Config.ts';

Deno.test({
    name: 'config with multiple add()',
    fn() {
        const config = new Config();

        config.add('hello', {
            hello: 'world',
        });

        config.add('hello2', {
            hello: 'world2',
        });

        config.add('hello3', {
            hello: 'world3',
        });

        assertEquals(config.get().hello, {
            hello: 'world',
        });

        assertEquals(config.get().hello3, {
            hello: 'world3',
        });
    },
});

Deno.test({
    name: 'config with multiple addMany()',
    fn() {
        const config = new Config();

        config.addMany({
            App: {
                hello: 'world',
            },
            Cache: {
                hello: 'world2',
            },
        });

        config.addMany({
            Database: {
                hello: 'world3',
            },
        });

        assertEquals(config.get().App.hello, 'world');
        assertEquals(config.get().Cache.hello, 'world2');
        assertEquals(config.get().Database.hello, 'world3');
    },
});
