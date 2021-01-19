import { Connection } from './Connection.ts';

export interface Driver {
    connect(connection: Connection): Promise<boolean>;
}
