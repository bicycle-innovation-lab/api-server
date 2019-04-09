import * as Koa from "koa";

declare const BodyParsers: (app: Koa) => void;
export = BodyParsers;

declare module "koa" {
    interface BaseRequest {
        json(): Promise<any>;
    }
}
