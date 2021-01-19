import * as Interface from './Interfaces/mod.ts';
import { Redis } from './Drivers/Redis.ts';

export class Cache {
    protected driver!: Interface.Driver;
    protected connection!: any;

    public parseDriver(driver: string): this {
        switch (driver) {
            case 'redis':
                this.setDriver(new Redis());

                break;
            default:
                throw new Error('Invalid cache driver');
        }

        return this;
    }

    public setDriver(driver: Interface.Driver): this {
        this.driver = driver;

        return this;
    }

    public async connect(connection: Interface.Connection) {
        if (!this.driver) {
            throw new Error('Missing cache driver');
        }

        await this.driver.connect(connection);
    }
}
