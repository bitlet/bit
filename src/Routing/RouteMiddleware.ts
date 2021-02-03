export enum Order {
    Before = 'before',
    After = 'after',
}

export class RouteMiddleware {
    public order: Order;
    public name: string;
    public callback: any;

    constructor(name: string, callback: any, order: Order) {
        this.name = name;
        this.callback = callback;
        this.order = order;
    }
}
