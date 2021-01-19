import { MysqlClient } from '../../../deps.ts';
import { Connection, Driver } from '../Interfaces/mod.ts';

export class Mysql implements Driver {
    protected connection!: MysqlClient;

    public async connect(connection: Connection): Promise<boolean> {
        const { host, username, password, database, port, debug } = connection;

        this.connection = await new MysqlClient().connect({
            hostname: host,
            username: username,
            password: password,
            db: database,
            port: port,
            debug: debug,
        });

        // Test the database connection.
        // @todo Remove when this issue is solved
        // https://github.com/denodrivers/mysql/issues/45
        try {
            await this.query('SHOW DATABASES');
        } catch (error) {
            return false;
        }

        return true;
    }

    public async query(query: string, binds: Array<any> = []) {
        try {
            return await this.connection.query(query, binds);
        } catch (error) {
            // @todo Throw a generic error which can be catched from Database.ts
            console.log('Mysql connection error');
        }
    }
}
