import { Application } from './Application.ts';
import { parse, Args } from 'https://deno.land/std@0.99.0/flags/mod.ts';

export class Cli extends Application {
    protected _args!: Args;

    public args(args: Array<string>) {
        this._args = parse(args);

        return this;
    }

    async serve(): Promise<void> {
        console.log(this._args);

        await Promise.resolve();
    }
}
