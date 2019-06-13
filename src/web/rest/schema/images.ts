import {joi} from "../../schema/common";

export const CreateImageRequestSchema = joi.object({
    title: joi.string().required(),
    alt: joi.string().required()
});
