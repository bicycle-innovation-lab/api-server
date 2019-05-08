import {arrayProp, instanceMethod, prop, Ref, Typegoose} from "typegoose";
import {ObjectID} from "mongodb";
import * as Mongoose from "mongoose";
import ImageRef from "./image-ref";
import {Category} from "./category";
import {cleanMongooseDocument} from "./utils";

export class Bike extends Typegoose {
    @prop({required: true})
    title!: string;

    @prop({required: true})
    description!: string;

    @arrayProp({items: ImageRef})
    images!: ImageRef[];

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
