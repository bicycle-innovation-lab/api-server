import * as Router from "koa-router";
import {GetMultipleCategories, GetOneCategory} from "./categories.get";

const CategoriesRouter = new Router();

CategoriesRouter.get("/", GetMultipleCategories);
CategoriesRouter.get("/:id", GetOneCategory);

export default CategoriesRouter;
