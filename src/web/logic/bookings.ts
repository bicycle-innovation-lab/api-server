import * as Koa from "koa";
import {BookingDocument, BookingModel} from "../../db/booking";
import {AuthLevel, getRoleLevel} from "../../auth/role";
import {UserModel} from "../../db/user";
import {BikeModel} from "../../db/bike";
import ValidationError from "./validation.error";
import InvalidReferenceError from "./invalid-reference.error";

export async function getBooking(ctx: Koa.Context, id: string): Promise<BookingDocument | undefined> {
    const filter: { [key: string]: any } = {_id: id};

    // only managers and up can see bookings made by other users
    const signedIn = await ctx.state.getUser();
    if (getRoleLevel(signedIn.role) < AuthLevel.Manager) {
        filter["user"] = signedIn._id;
    }

    return await BookingModel.findOne(filter) || undefined;
}

export interface ListBookingsOptions {
    filter?: {
        bike?: string | string[];
    }
}

export async function listBookings(ctx: Koa.Context, opts: ListBookingsOptions = {}): Promise<BookingDocument[]> {
    const filter: { [key: string]: any } = {};

    // only managers and up can see bookings made by other users
    const signedIn = await ctx.state.getUser();
    if (signedIn.authLevel < AuthLevel.Manager) {
        filter["user"] = signedIn._id;
    }

    if (opts.filter) {
        if (opts.filter.bike) {
            let f;
            f = !Array.isArray(opts.filter.bike)
                ? opts.filter.bike.length === 1
                    ? opts.filter.bike[0]
                    : {$in: opts.filter.bike}
                : opts.filter.bike;
            filter["bike"] = f;
        }
    }

    return await BookingModel.find(filter);
}

export interface CreateBookingOptions {
    startTime: Date;
    endTime: Date;
    bike: string;
    user: string;
}

export async function createBooking(ctx: Koa.Context, opts: CreateBookingOptions): Promise<BookingDocument> {
    ctx.testPermission(AuthLevel.User);

    if (opts.endTime <= opts.startTime) {
        throw new ValidationError("End time must be after start time");
    }

    // only managers can create bookings on behalf of another user
    if (opts.user) {
        await ctx.testPermission(AuthLevel.Manager);

        // check if the given user exists
        const count = await UserModel.count({_id: opts.user}).exec();
        if (count <= 0) {
            throw new InvalidReferenceError(`User with id "${opts.user}" does not exist`);
        }
    }

    // check if the given bike exists
    const count = await BikeModel.count({_id: opts.bike}).exec();
    if (count <= 0) {
        throw new InvalidReferenceError(`Bike with id "${opts.bike}" does not exist`);
    }

    const booking = new BookingModel(opts);
    await booking.save();

    return booking;
}
