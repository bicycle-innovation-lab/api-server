import * as Router from "koa-router";
import GetCategories from "./categories.get";

const CategoriesRouter = new Router();

CategoriesRouter.get("/", GetCategories);

export default CategoriesRouter;
