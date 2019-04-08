import {prop, Ref, Typegoose} from "typegoose";
import {Bike} from "./bike";
import {User} from "./user";

export class Booking extends Typegoose {
    @prop({required: true})
    startTime!: Date;

    @prop({required: true})
    endTime!: Date;

    @prop({ref: Bike})
    bike!: Ref<Bike>;

    @prop({ref: User})
    user!: Ref<User>;
}
export const BookingModel = new Booking().getModelForClass(Booking);
