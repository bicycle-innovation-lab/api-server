import * as Koa from "koa";
import * as KoaJWT from "koa-jwt";
import * as KoaBodyParser from "koa-body-parsers";
import * as cors from "@koa/cors";
import {Secret} from "../auth/token";
import Routes from "./routes";
import PopulateUser from "./middleware/populate-user";
import FormatResponse from "./middleware/format-message";
import TestPermission from "./plugins/test-permissions";
import JoiValidate from "./plugins/joi-validate";
import NotFound from "./middleware/not-found";

export const Server = new Koa();

KoaBodyParser(Server);
TestPermission(Server);
JoiValidate(Server);

Server.use(KoaJWT({secret: Secret, passthrough: true, key: "authToken"}));
Server.use(PopulateUser);

Server.use(FormatResponse);

// Change origin before release
Server.use(cors({origin: '*'}))
Server.use(Routes.routes());
Server.use(Routes.allowedMethods());

Server.use(NotFound);
