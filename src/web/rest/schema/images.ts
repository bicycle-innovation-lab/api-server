import {joi} from "./common";

export const CreateImageRequestSchema = joi.object({
    title: joi.string().required(),
    alt: joi.string().required()
});
