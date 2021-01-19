import { serve, ServerRequest } from '../deps.ts';
import { Webserver, WebSocket } from '../deps.ts';
import { Controller } from './Controllers/Interfaces/Controller.ts';
import { Env } from './Env/Env.ts';
import { Registry } from './Registry/Registry.ts';
import { Routing } from './Routing/Routing.ts';

export class Application {
    protected controllerCollection!: Array<Controller>;

    public controllers(controllers: Array<Controller>): this {
        this.controllerCollection = controllers;

        return this;
    }

    public registry(): this {
        return this;
    }

    public async prepare() {
        return this;
    }

    async serve() {
        const { host, port } = Registry.get(Env).get('Server');

        const server = serve({ hostname: host, port });

        console.log(`HTTP/WS server is running on ${host}:${port}`);

        for await (const request of server) {
            if (Webserver.acceptable(request)) {
                this.ws(request);
            } else {
                this.http(request);
            }
        }
    }

    private async http(request: ServerRequest) {
        const response: string = await Routing.matchUri(request.method, request.url);

        request.respond({ status: 200, body: response });
    }

    private async ws(request: ServerRequest) {
        const { conn, r: bufReader, w: bufWriter, headers } = request;

        Webserver.acceptWebSocket({ conn, bufReader, bufWriter, headers })
            .then(async (request: WebSocket) => {
                try {
                    for await (const event of request) {
                        if (typeof event === 'string') {
                            let input = JSON.parse(event);

                            const response: string = await Routing.matchUri(input.method, input.uri);

                            await request.send(response);
                        } else if (event instanceof Uint8Array) {
                            console.log('ws:Binary', event);
                        } else if (Webserver.isWebSocketPingEvent(event)) {
                            const [, body] = event;
                            console.log('ws:Ping', body);
                        } else if (Webserver.isWebSocketCloseEvent(event)) {
                            const { code, reason } = event;
                            console.log('ws:Close', code, reason);
                        }
                    }
                } catch (error) {
                    console.error(`Failed to receive frame: ${error}`);

                    if (!request.isClosed) {
                        await request.close(1000).catch(console.error);
                    }
                }
            })
            .catch(async (error) => {
                console.error(`Failed to accept websocket: ${error}`);

                await request.respond({ status: 400 });
            });
    }
}
