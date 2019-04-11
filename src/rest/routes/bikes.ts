import * as Router from "koa-router";
import {GetMultipleBikes} from "./bikes.get";
import PostBikes from "./bikes.post";

const BikesRouter = new Router();

BikesRouter.post("/", PostBikes);
BikesRouter.get("/", GetMultipleBikes);

export default BikesRouter;
