import { Application } from './Application.ts';

export class Cli extends Application {
    protected _args!: Array<string>;

    public args(args: Array<string>) {
        this._args = args;

        return this;
    }

    async serve(): Promise<void> {
        await Promise.resolve(console.log(this._args));
    }
}
