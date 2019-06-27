import * as Koa from "koa";
import {Booking, BookingDocument} from "../../db/booking";
import {AuthLevel, getRoleLevel} from "../../auth/role";
import ValidationError from "./validation.error";
import InvalidReferenceError from "./invalid-reference.error";
import {Filter} from "../../db/controller/filter";

export async function getBooking(ctx: Koa.Context, id: string): Promise<BookingDocument | undefined> {
    let filter: Filter<Booking> | string = id;

    // only managers and up can see bookings made by other users
    const signedIn = await ctx.state.getUser();
    if (getRoleLevel(signedIn.role) < AuthLevel.Manager) {
        filter = {id, user: signedIn.id};
    }

    return await ctx.state.db.bookings.find(filter) || undefined;
}

export interface ListBookingsOptions {
    filter?: Filter<Booking>
}

export async function listBookings(ctx: Koa.Context, opts: ListBookingsOptions = {}): Promise<BookingDocument[]> {
    const filter: Filter<Booking> = Object.assign({}, opts.filter);

    // only managers and up can see bookings made by other users
    const signedIn = await ctx.state.getUser();
    if (signedIn.authLevel < AuthLevel.Manager) {
        filter.user = signedIn.id;
    }

    return await ctx.state.db.bookings.list(filter);
}

export interface CreateBookingOptions {
    startTime: Date;
    endTime: Date;
    bike: string;
    user?: string;
}

export async function createBooking(ctx: Koa.Context, opts: CreateBookingOptions): Promise<BookingDocument> {
    await ctx.testPermission(AuthLevel.User);

    if (opts.endTime <= opts.startTime) {
        throw new ValidationError("End time must be after start time");
    }

    // only managers can create bookings on behalf of another user
    if (opts.user) {
        await ctx.testPermission(AuthLevel.Manager);

        // check if the given user exists
        const count = await ctx.state.db.users.count({id: opts.user});
        if (count <= 0) {
            throw new InvalidReferenceError(`User with id "${opts.user}" does not exist`);
        }
    } else {
        opts.user = (await ctx.state.getUser()).id;
    }

    // check if the given bike exists
    const count = await ctx.state.db.bikes.count({id: opts.bike});
    if (count <= 0) {
        throw new InvalidReferenceError(`Bike with id "${opts.bike}" does not exist`);
    }

    const booking = ctx.state.db.bookings.newDocument(opts);
    await booking.save();

    return booking;
}
