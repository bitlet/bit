export class Env {
    protected collection: { [key: string]: unknown } = {};

    constructor(collection: { [key: string]: unknown }) {
        this.collection = collection;
    }

    // deno-lint-ignore no-explicit-any
    public get(): any {
        return this.collection;
    }
}
