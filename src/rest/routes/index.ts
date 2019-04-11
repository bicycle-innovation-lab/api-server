import * as Router from "koa-router";
import UsersRouter from "./users";
import TokensRouter from "./tokens";
import BikesRouter from "./bikes";
import CategoriesRouter from "./categories";

const Routes = new Router();

Routes.use("/users", UsersRouter.routes(), UsersRouter.allowedMethods());
Routes.use("/tokens", TokensRouter.routes(), TokensRouter.allowedMethods());
Routes.use("/bikes", BikesRouter.routes(), BikesRouter.allowedMethods());
Routes.use("/categories", CategoriesRouter.routes(), CategoriesRouter.allowedMethods());

export default Routes;
