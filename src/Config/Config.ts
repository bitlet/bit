export class Config {
    public static instance: Config;

    protected configs: { [key: string]: any } = {};

    constructor() {
        if (Config.instance) {
            throw new Error('Config is already initiated');
        }

        Config.instance = this;
    }

    public add(key: string, value: { [key: string]: any }): this {
        this.configs[key] = { ...this.configs[key], ...value };

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
            return this.configs[key];
        }

        return this.configs;
    }
}
