// deno-lint-ignore-file no-explicit-any

import { Connection } from './Connection.ts';

export interface Driver {
    connect(connection: Connection): Promise<boolean>;
    query(query: string, binds: unknown[]): any;
}
