export class RouteMethod {
    public name: string;
    public callback: any;

    constructor(name: string, callback?: any) {
        this.name = name;
        this.callback = callback;
    }
}
