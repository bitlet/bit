export class Registry {
    public static instance: Registry;
    public static instances: any = {};

    constructor() {
        if (Registry.instance) {
            throw new Error('Config is already initiated');
        }

        Registry.instance = this;
    }

    public registerMany(instances: Array<any>) {
        for (const instance of instances) {
            this.register(instance);
        }
    }

    public register(instance: any) {
        const name = instance.constructor.name;

        if (!Registry.instances[name]) {
            Registry.instances[name] = instance;
        }
    }

    public static get(instance: any) {
        return this.instances[instance.name];
    }
}
