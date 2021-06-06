export class Config {
    /**
     * Example:
     *
     * {
     *   Database: {
     *     host: "localhost",
     *     user: "root",
     *     pass: "secret"
     *   },
     *   data: [1, 2, 3]
     * }
     */
    protected collection: { [key: string]: { [key: string]: unknown } | unknown[] } = {};

    public add(key: string, value: { [key: string]: unknown }): this {
        this.collection[key] = { ...this.collection[key], ...(value as Record<string, unknown>) };

        return this;
    }

    public addMany(configs: { [key: string]: unknown }): this {
        for (const [key, value] of Object.entries(configs)) {
            this.add(key, value as Record<string, unknown>);
        }

        return this;
    }

    // deno-lint-ignore no-explicit-any
    public get(): any {
        return this.collection;
    }
}
