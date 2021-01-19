import { RedisConnect } from '../../../deps.ts';
import { Connection, Driver } from '../Interfaces/mod.ts';

export class Redis implements Driver {
    protected connection!: any;

    public async connect(connection: Connection): Promise<boolean> {
        const { host, port } = connection;

        this.connection = await RedisConnect({
            hostname: host,
            port: port,
        });

        return this.connection.isConnected;
    }
}
