import { RedisConnect } from '../../../deps.ts';

export class Redis {
    public async connect() {
        return await RedisConnect({
            hostname: '127.0.0.1',
            port: 6379,
        });
    }
}
