import * as Interface from './Interfaces/mod.ts';

export class Database {
    protected driver!: Interface.Driver;
    protected connection!: any;

    public setDriver(driver: Interface.Driver) {
        this.driver = driver;

        return this;
    }

    public async connect(connection: Interface.Connection) {
        if (!this.driver) {
            throw new Error('Missing driver');
        }

        await this.driver.connect(connection);
    }

    public async query(query: string, binds: Array<any>) {
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
