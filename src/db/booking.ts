import * as Mongoose from "mongoose";
import {instanceMethod, prop, Ref, Typegoose} from "typegoose";
import {Bike} from "./bike";
import {User} from "./user";
import {cleanMongooseDocument} from "./utils";

export class Booking extends Typegoose {
    @prop({required: true})
    startTime!: Date;

    @prop({required: true})
    endTime!: Date;

    @prop({ref: Bike})
    bike!: Ref<Bike>;

    @prop({ref: User})
    user!: Ref<User>;

    @instanceMethod
    toCleanObject(this: BookingDocument) {
        cleanMongooseDocument(this.toObject());
    }
}
export const BookingModel = new Booking().getModelForClass(Booking);
export type BookingDocument = Booking & Mongoose.Document;
