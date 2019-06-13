import * as Router from "koa-router";
import {GetMultipleBikes, GetOneBike} from "./bikes.get";
import PostBikes from "./bikes.post";

const BikesRouter = new Router();

BikesRouter.post("/", PostBikes);
BikesRouter.get("/", GetMultipleBikes);
BikesRouter.get("/:id", GetOneBike);

export default BikesRouter;
