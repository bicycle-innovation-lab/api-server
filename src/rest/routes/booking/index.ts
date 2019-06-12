import * as Router from "koa-router";
// import {GetMultipleBikes, GetOneBike} from "./bikes.get";
import PostBookings from "./bookings.post";

const BookingsRouter = new Router();

BookingsRouter.post("/", PostBookings);
// BookingsRouter.get("/", GetMultipleBookings);
// BookingsRouter.get("/:id", GetOneBooking);

export default BookingsRouter;
