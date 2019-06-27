import * as Router from "koa-router";
import {GetCategoryBikes, GetMultipleCategories, GetOneCategory} from "./categories.get";
import PostCategories from "./categories.post";
import PutCategories from "./categories.put";

const CategoriesRouter = new Router();

CategoriesRouter.post("/", PostCategories);
CategoriesRouter.get("/", GetMultipleCategories);
CategoriesRouter.get("/:id", GetOneCategory);
CategoriesRouter.put("/:id", PutCategories);
CategoriesRouter.get("/:id/bikes", GetCategoryBikes);

export default CategoriesRouter;
