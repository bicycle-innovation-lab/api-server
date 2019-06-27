import * as Koa from "koa";
import {UserController} from "../../db/user";
import {BikeController} from "../../db/bike";
import {BookingController} from "../../db/booking";
import {ImageController} from "../../db/image";
import {CategoryController} from "../../db/category";

const AttachDB: Koa.Middleware = (ctx, next) => {
    ctx.state.db = {
        bikes: BikeController,
        bookings: BookingController,
        categories: CategoryController,
        images: ImageController,
        users: UserController
    };
    return next();
};
export default AttachDB;
