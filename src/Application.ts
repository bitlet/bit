import { Controller } from './Controller/Controller.ts';
import { Env } from './Env/Env.ts';
import { Registry } from './Registry/Registry.ts';
import { Response as BitResponse } from './Response/Response.ts';
import { Routing } from './Routing/Routing.ts';
// import { Webserver, WebSocket } from '../deps.ts';
// import { serve, ServerRequest } from '../deps.ts';

new Registry().register(new Routing());

export interface ServeOptions {
    host?: string;
    port?: number;
}

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
        return await Promise.resolve(this);
    }

    public async serve(options?: ServeOptions): Promise<void> {
        let env: { [key: string]: string } = {};

        if (Registry.get(Env)) {
            env = Registry.get(Env).get().Server;
        }

        const host = options?.host || env.host || '0.0.0.0';
        const port = options?.port || Number(env.port) || 80;

        const server = Deno.listen({ hostname: host, port: port });

        for await (const connection of server) {
            this.server(connection);
        }

        console.log(`HTTP/WS server is running on ${host}:${port}`);
    }

    private async server(connection: Deno.Conn) {
        const httpConnection = Deno.serveHttp(connection);

        for await (const event of httpConnection) {
            const response: BitResponse = await Registry.get(Routing).matchUri(
                event.request.method,
                new URL(event.request.url),
            );

            const headers = new Headers({
                server: 'Bitlet',
                'content-type': response.format,
            });

            if (response.isJson()) {
                await event.respondWith(
                    new Response(response.getAsJson(), {
                        status: response.status,
                        headers: headers,
                    }),
                );
            } else {
                await event.respondWith(
                    new Response(response.getBodyAsString(), {
                        status: response.status,
                        headers: headers,
                    }),
                );
            }
        }
    }

    // private async ws(request: ServerRequest) {
    //     const { conn, r: bufReader, w: bufWriter, headers } = request;

    //     await Webserver.acceptWebSocket({ conn, bufReader, bufWriter, headers })
    //         .then(async (request: WebSocket) => {
    //             try {
    //                 for await (const event of request) {
    //                     if (typeof event === 'string') {
    //                         const input = JSON.parse(event);

    //                         const response: BitResponse = await Registry.get(Routing).matchUri(input.method, input.uri);

    //                         await request.send(response.getAsJson());
    //                     } else if (event instanceof Uint8Array) {
    //                         console.log('ws:Binary', event);
    //                     } else if (Webserver.isWebSocketPingEvent(event)) {
    //                         const [, body] = event;
    //                         console.log('ws:Ping', body);
    //                     } else if (Webserver.isWebSocketCloseEvent(event)) {
    //                         const { code, reason } = event;
    //                         console.log('ws:Close', code, reason);
    //                     }
    //                 }
    //             } catch (error) {
    //                 console.error(`Failed to receive frame: ${error}`);

    //                 if (!request.isClosed) {
    //                     await request.close(1000).catch(console.error);
    //                 }
    //             }
    //         })
    //         .catch(async (error: string) => {
    //             console.error(`Failed to accept websocket: ${error}`);

    //             await request.respond({ status: 400 });
    //         });
    // }
}
