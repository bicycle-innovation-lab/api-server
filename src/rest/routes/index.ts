import * as Router from "koa-router";
import UsersRouter from "./users";
import TokensRouter from "./tokens";

const Routes = new Router();

Routes.use("/users", UsersRouter.routes(), UsersRouter.allowedMethods());
Routes.use("/tokens", TokensRouter.routes(), TokensRouter.allowedMethods());

export default Routes;
