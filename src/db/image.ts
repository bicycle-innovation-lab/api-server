import {prop, Typegoose} from "typegoose";

export default class Image extends Typegoose {
    @prop({required: true})
    smallImage!: string;

    @prop({required: true})
    largeImage!: string;
}
