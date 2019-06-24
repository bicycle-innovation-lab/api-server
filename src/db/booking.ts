import * as Mongoose from "mongoose";
import {instanceMethod, prop, Ref, Typegoose} from "typegoose";
import {User} from "./user";
import {cleanMongooseDocument} from "./utils";
import {Schema} from "mongoose";

export class Booking extends Typegoose {
    @prop({required: true})
    startTime!: Date;

    @prop({required: true})
    endTime!: Date;

    @prop({required: true})
    bike!: Mongoose.Types.ObjectId;

    @prop({ref: User})
    user!: Ref<User>;

    @instanceMethod
    toCleanObject(this: BookingDocument) {
        return cleanMongooseDocument(this.toObject());
    }
}
export const BookingModel = new Booking().getModelForClass(Booking);
export type BookingDocument = Booking & Mongoose.Document;
