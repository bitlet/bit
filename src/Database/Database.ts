import * as Interface from './Interfaces/mod.ts';
import { Mysql } from './Drivers/Mysql.ts';

export class Database {
    protected driver!: Interface.Driver;
    protected connection!: Interface.Connection;

    public parseDriver(driver: string): this {
        switch (driver) {
            case 'mysql':
                this.setDriver(new Mysql());

                break;
            default:
                throw new Error('Invalid database driver');
        }

        return this;
    }
    public setDriver(driver: Interface.Driver): this {
        this.driver = driver;

        return this;
    }

    public async connect(connection: Interface.Connection) {
        if (!this.driver) {
            throw new Error('Missing database driver');
        }

        await this.driver.connect(connection);
    }

    public async query(query: string, binds: unknown[]) {
        if (!this.driver) {
            console.log('Waring: Missing database driver');

            return [];
        }

        try {
            return await this.driver.query(query, binds);
        } catch (error) {
            console.log(error);
        }
    }
}
