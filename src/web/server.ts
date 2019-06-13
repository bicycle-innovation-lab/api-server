import * as Koa from "koa";
import * as KoaJWT from "koa-jwt";
import * as KoaBodyParser from "koa-body-parsers";
import * as KoaCORS from "@koa/cors";
import {Secret} from "../auth/token";
import Routes from "./rest/routes";
import PopulateUser from "./middleware/populate-user";
import FormatResponse from "./middleware/format-message";
import TestPermission from "./plugins/test-permissions";
import JoiValidate from "./plugins/joi-validate";

export const Server = new Koa();

KoaBodyParser(Server);
TestPermission(Server);
JoiValidate(Server);

Server.use(KoaJWT({secret: Secret, passthrough: true, key: "authToken"}));
Server.use(PopulateUser);

Server.use(FormatResponse);

// TODO: Change origin before release
Server.use(KoaCORS({origin: '*'}));
Server.use(Routes.routes());
Server.use(Routes.allowedMethods());
