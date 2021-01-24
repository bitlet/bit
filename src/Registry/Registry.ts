export class Registry {
    public static instance: Registry | null;
    public static instances: any = {};

    constructor() {
        if (Registry.instance) {
            throw new Error('Registry is already initiated');
        }

        Registry.instance = this;
    }

    public registerMany(instances: Array<any>): this {
        for (const instance of instances) {
            this.register(instance);
        }

        return this;
    }

    public register(instance: any): this {
        const name = instance.constructor.name;

        if (!Registry.instances[name]) {
            Registry.instances[name] = instance;
        }

        return this;
    }

    public static get(instance: any): any {
        return this.instances[instance.name];
    }

    public static clear(): void {
        this.instance = null;
        this.instances = {};
    }
}
