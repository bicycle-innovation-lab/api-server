import * as Koa from "koa";
import * as KoaJWT from "koa-jwt";
import {Secret} from "../auth/token";
import Routes from "./routes";
import PopulateUser from "./middleware/populate-user";
import FormatResponse from "./middleware/format-message";

export const Server = new Koa();

Server.use(KoaJWT({secret: Secret, passthrough: true, key: "userId"}));
Server.use(PopulateUser);

Server.use(FormatResponse);

Server.use(Routes.routes());
Server.use(Routes.allowedMethods());
