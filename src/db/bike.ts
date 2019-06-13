import {arrayProp, instanceMethod, pre, prop, Ref, Typegoose} from "typegoose";
import {ObjectID} from "mongodb";
import * as Mongoose from "mongoose";
import {Category} from "./category";
import {Image} from "./image";

@pre("validate", function(this: Bike, next) {
// noinspection JSPotentiallyInvalidUsageOfClassThis
    if (this.featuredImage < 0 || this.featuredImage >= this.images.length) {
// noinspection JSPotentiallyInvalidUsageOfClassThis
        this.featuredImage = 0
    }
    return next();
})
export class Bike extends Typegoose {
    @prop({required: true})
    title!: string;

    @prop({required: true})
    description!: string;

    @arrayProp({itemsRef: Image})
    images!: Ref<Image>[];

    @prop({required: true, default: 0})
    featuredImage!: number;

    @prop({required: true})
    price!: number;

    @prop({default: 0})
    discount!: number;

    @arrayProp({required: true, itemsRef: Category})
    categories!: Ref<Category>[];

    @instanceMethod
    toCleanObject(this: BikeDocument) {
        return this.toObject({
            transform(doc, ret) {
                ret.id = new ObjectID(ret._id);
                delete ret._id;
                delete ret.__v;
            }
        });
    }
}

export const BikeModel = new Bike().getModelForClass(Bike);
export type BikeDocument = Bike & Mongoose.Document;
