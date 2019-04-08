import * as Router from "koa-router";
import UsersRouter from "./users";

export const Routes = new Router();
Routes.use("/users", UsersRouter.routes(), UsersRouter.allowedMethods());
