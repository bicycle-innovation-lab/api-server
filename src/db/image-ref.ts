import {prop, Typegoose} from "typegoose";

export default class ImageRef extends Typegoose {
    @prop({required: true})
    title!: string;

    @prop({required: true})
    alt!: string;

    @prop({required: true})
    smallImage!: string;

    @prop({required: true})
    largeImage!: string;
}
