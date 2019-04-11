import * as Koa from "koa";
import {CategoryModel} from "../../db/category";

const GetCategories: Koa.Middleware = async () => {
    return (await CategoryModel.find()).map(it => it.toCleanObject());
};
export default GetCategories;
