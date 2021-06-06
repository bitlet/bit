// deno-lint-ignore-file no-explicit-any

export class Registry {
    private static _instance: Registry | null;
    private static instances: any = {};

    constructor() {
        if (Registry._instance) {
            throw new Error('Registry is already initiated');
        }

        Registry._instance = this;
    }

    public register(...instances: Array<any>): this {
        for (const instance of instances) {
            const name = instance.constructor.name;

            if (!Registry.instances[name]) {
                Registry.instances[name] = instance;
            }
        }

        return this;
    }

    public static instance(): Registry {
        if (!this._instance) {
            return new Registry();
        }

        return this._instance;
    }

    public static get(instance: any): any {
        return this.instances[instance.name];
    }

    public static clear(): void {
        this._instance = null;
        this.instances = {};
    }
}
