import * as Mongoose from "mongoose";
import {ObjectId, prop, Reference} from "./utils";
import {BikeDocument} from "./bike";
import {UserDocument} from "./user";
import {schema} from "./schema";
import {ref, required} from "./modifiers";

export interface Booking {
    startTime: Date;
    endTime: Date;
    bike: Reference<BikeDocument>;
    user: Reference<UserDocument>;
}

const bookingSchema = schema<Booking>({
    startTime: prop(Date, [required]),
    endTime: prop(Date, [required]),
    bike: prop(ObjectId, [required, ref("bike")]),
    user: prop(ObjectId, [required, ref("user")])
});
export type BookingDocument = Booking & Mongoose.Document;
export const BookingModel = Mongoose.model<BookingDocument>("booking", bookingSchema);
