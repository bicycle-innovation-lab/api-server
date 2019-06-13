import * as Router from "koa-router";
import UsersRouter from "./users";
import TokensRouter from "./tokens";
import BikesRouter from "./bikes";
import BookingsRouter from './booking';
import CategoriesRouter from "./categories";
import ImagesRouter from "./images";

const Routes = new Router();

Routes.use("/users", UsersRouter.routes(), UsersRouter.allowedMethods());
Routes.use("/tokens", TokensRouter.routes(), TokensRouter.allowedMethods());
Routes.use("/bikes", BikesRouter.routes(), BikesRouter.allowedMethods());
Routes.use("/bookings", BookingsRouter.routes(), BookingsRouter.allowedMethods())
Routes.use("/categories", CategoriesRouter.routes(), CategoriesRouter.allowedMethods());
Routes.use("/images", ImagesRouter.routes(), ImagesRouter.allowedMethods());

export default Routes;
