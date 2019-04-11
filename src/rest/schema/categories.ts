import {joi} from "./common";

export const CreateCategoryRequestSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required()
}).required();
