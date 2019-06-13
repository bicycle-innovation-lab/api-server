import * as Router from "koa-router";
import {GetMultipleCategories, GetOneCategory} from "./categories.get";
import PostCategories from "./categories.post";
import PutCategories from "./categories.put";

const CategoriesRouter = new Router();

CategoriesRouter.post("/", PostCategories);
CategoriesRouter.get("/", GetMultipleCategories);
CategoriesRouter.get("/:id", GetOneCategory);
CategoriesRouter.put("/:id", PutCategories);

export default CategoriesRouter;
