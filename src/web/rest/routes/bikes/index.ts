import * as Router from "koa-router";
import {GetBikeBookings, GetMultipleBikes, GetOneBike} from "./bikes.get";
import PostBikes from "./bikes.post";

const BikesRouter = new Router();

BikesRouter.post("/", PostBikes);
BikesRouter.get("/", GetMultipleBikes);
BikesRouter.get("/:id", GetOneBike);
BikesRouter.get("/:id/bookings", GetBikeBookings);

export default BikesRouter;
