import { Application } from './Application.ts';

export class Cli extends Application {
    protected argsCollection!: Array<string>;

    public args(args: Array<string>) {
        this.argsCollection = args;

        return this;
    }

    async serve() {
        console.log(this.argsCollection);
    }
}
