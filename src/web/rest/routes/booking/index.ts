import * as Router from "koa-router";
// import {GetMultipleBikes, GetOneBike} from "./bikes.get";
import PostBookings from "./bookings.post";
import {GetMultipleBookings, GetOneBooking} from "./bookings.get";

const BookingsRouter = new Router();

BookingsRouter.post("/", PostBookings);
BookingsRouter.get("/", GetMultipleBookings);
BookingsRouter.get("/:id", GetOneBooking);
// BookingsRouter.get("/", GetMultipleBookings);
// BookingsRouter.get("/:id", GetOneBooking);

export default BookingsRouter;
