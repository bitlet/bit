import { Controller } from './Controller/Controller.ts';
import { Registry } from './Registry/Registry.ts';
import { Response as BitResponse } from './Response/Response.ts';
import { Request as BitRequest, Body } from './Request/Request.ts';
import { Routing } from './Routing/Routing.ts';

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

    public async listen(options?: ServeOptions): Promise<void> {
        const host = options?.host || '0.0.0.0';
        const port = options?.port || 80;

        try {
            const server = Deno.listen({ hostname: host, port: port });

            for await (const connection of server) {
                this.handle(connection);
            }
        } catch (e) {
            console.log(e);
        }
    }

    private async handle(connection: Deno.Conn) {
        const httpConnection = Deno.serveHttp(connection);

        for await (const event of httpConnection) {
            if (event.request.headers.get('upgrade') === 'websocket') {
                const { socket, response } = Deno.upgradeWebSocket(event.request);

                socket.onopen = () => console.log('Socket opened');

                socket.onmessage = async (e) => {
                    const data = JSON.parse(e.data);
                    const url = 'https://127.0.0.1' + data.url;

                    const response = await this.serve(data.method, url, data.headers, data.body);

                    socket.send(response.getAsJson());
                };

                socket.onerror = (e) => console.log('Socket error:', e);

                socket.onclose = () => console.log('Socket closed');

                await event.respondWith(response);

                continue;
            }

            let body: Body = {};

            // @todo Move to Request
            if (event.request.method !== 'GET') {
                const contentType = event.request.headers.get('content-type') ?? '';

                if (contentType.startsWith('application/json')) {
                    body = await event.request.json();
                } else if (
                    contentType.startsWith('application/x-www-form-urlencoded') ||
                    contentType.startsWith('multipart/form-data')
                ) {
                    const formData = await event.request.formData();

                    for (const [key, value] of formData.entries()) {
                        if (value instanceof File) {
                            console.log(value.name);
                            console.log(value.size);
                            console.log(value.stream());
                        }

                        body[key] = value;
                    }
                } else {
                    return await event.respondWith(
                        new Response('Something went wrong', {
                            status: 400,
                            headers: new Headers(),
                        }),
                    );
                }
            }

            const response = await this.serve(
                event.request.method,
                event.request.url,
                event.request.headers,
                body,
            );

            if (response.isJson()) {
                await event.respondWith(
                    new Response(response.getAsJson(), {
                        status: response.status,
                        headers: response.headers,
                    }),
                );
            } else {
                await event.respondWith(
                    new Response(response.getBodyAsString(), {
                        status: response.status,
                        headers: response.headers,
                    }),
                );
            }
        }
    }

    private async serve(method: string, url: string, headers: Headers, body: Body) {
        const routing = Registry.get(Routing);

        const response: BitResponse = await routing.matchUri(
            new BitRequest({
                method: method,
                url: new URL(url),
                headers: headers,
                body: body,
            }),
        );

        response.headers = new Headers({
            server: 'Bitlet',
            'content-type': response.format,
        });

        return response;
    }
}
