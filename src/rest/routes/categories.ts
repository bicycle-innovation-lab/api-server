import * as Router from "koa-router";
import {GetMultipleCategories, GetOneCategory} from "./categories.get";
import PostCategories from "./categories.post";

const CategoriesRouter = new Router();

CategoriesRouter.post("/", PostCategories);
CategoriesRouter.get("/", GetMultipleCategories);
CategoriesRouter.get("/:id", GetOneCategory);

export default CategoriesRouter;
