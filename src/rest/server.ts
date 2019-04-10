import * as Koa from "koa";
import * as KoaJWT from "koa-jwt";
import * as KoaBodyParser from "koa-body-parsers";
import {Secret} from "../auth/token";
import Routes from "./routes";
import PopulateUser from "./middleware/populate-user";
import FormatResponse from "./middleware/format-message";
import TestPermission from "./plugins/test-permissions";

export const Server = new Koa();

KoaBodyParser(Server);
TestPermission(Server);

Server.use(KoaJWT({secret: Secret, passthrough: true, key: "authToken"}));
Server.use(PopulateUser);

Server.use(FormatResponse);

Server.use(Routes.routes());
Server.use(Routes.allowedMethods());
