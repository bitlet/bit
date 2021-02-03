import { Controller } from '../Controller/Controller.ts';
import { Response } from '../Response/Response.ts';

export interface MiddlewareInterface {
    execute(): Promise<void | Response>;
}

export class Middleware implements MiddlewareInterface {
    protected controller!: any;
    protected method!: any;

    constructor(controller: Controller, method: any) {
        this.controller = controller;
        this.method = method;
    }

    public async execute(): Promise<void | Response> {}
}
