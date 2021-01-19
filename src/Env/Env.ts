export class Env {
    protected collection: any;

    constructor(source: any) {
        this.collection = source;
    }

    public get(key: string = '') {
        if (key) {
            return this.collection[key];
        }

        return this.collection;
    }
}
