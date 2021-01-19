import { Controller } from '../Controllers/Interfaces/Controller.ts';

export class Route {
    controller: Controller;
    method: PropertyDescriptor;

    constructor(controller: Controller, method: PropertyDescriptor) {
        this.controller = controller;
        this.method = method;
    }
}
