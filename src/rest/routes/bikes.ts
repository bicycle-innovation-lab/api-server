import * as Router from "koa-router";
import {GetMultipleBikes} from "./bikes.get";

const BikesRouter = new Router();

BikesRouter.get("/", GetMultipleBikes);

export default BikesRouter;
