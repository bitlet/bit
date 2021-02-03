import { Controller } from './Controller/Controller.ts';
import { Env } from './Env/Env.ts';
import { Registry } from './Registry/Registry.ts';
import { Response } from './Response/Response.ts';
import { Routing } from './Routing/Routing.ts';
import { Webserver, WebSocket } from '../deps.ts';
import { serve, ServerRequest } from '../deps.ts';

new Registry().register(new Routing());

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

    public async serve(options: { [key: string]: any } = {}) {
        const env = Registry.get(Env).get('Server');

        const host = options.host || env.host || 'localhost';
        const port = options.port || env.port || 80;

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
        console.log(Registry.get(Routing).routes);
        const response: Response = await Registry.get(Routing).matchUri(request.method, request.url);

        if (response.isJson()) {
            request.respond({ status: response.status, body: response.getAsJson() });
        } else {
            request.respond({ status: response.status, body: response.body });
        }
    }

    private async ws(request: ServerRequest) {
        const { conn, r: bufReader, w: bufWriter, headers } = request;

        Webserver.acceptWebSocket({ conn, bufReader, bufWriter, headers })
            .then(async (request: WebSocket) => {
                try {
                    for await (const event of request) {
                        if (typeof event === 'string') {
                            let input = JSON.parse(event);

                            const response: Response = await Registry.get(Routing).matchUri(input.method, input.uri);

                            await request.send(response.getAsJson());
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
            .catch(async (error: string) => {
                console.error(`Failed to accept websocket: ${error}`);

                await request.respond({ status: 400 });
            });
    }
}
