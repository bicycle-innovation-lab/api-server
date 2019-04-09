import * as Koa from "koa";
import * as KoaJWT from "koa-jwt";
import {Secret} from "../auth/token";
import Routes from "./routes";
import PopulateUser from "./middleware/populate-user";

export const Server = new Koa();

Server.use(KoaJWT({secret: Secret, passthrough: true, key: "userId"}));
Server.use(PopulateUser);

// reformat data before sending
Server.use(async (ctx, next) => {
    const data = await next();
    ctx.body = JSON.stringify({data, code: 200});
});

Server.use(Routes.routes());
Server.use(Routes.allowedMethods());
