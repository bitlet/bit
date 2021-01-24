export class Config {
    protected collection: { [key: string]: any } = {};

    public add(key: string, value: { [key: string]: any }): this {
        this.collection[key] = { ...this.collection[key], ...value };

        return this;
    }

    public addMany(configs: { [key: string]: any }): this {
        for (const [key, value] of Object.entries(configs)) {
            this.add(key, value);
        }

        return this;
    }

    public get(key: string = ''): any {
        if (key) {
            return this.collection[key];
        }

        return this.collection;
    }
}
