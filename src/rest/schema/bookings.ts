import {joi, ObjectId} from "./common";

export const CreateBookingRequestSchema = joi.object({
    startTime: joi.date().required(),
    endTime: joi.date().required(),
    bike: ObjectId().required(),
    user: ObjectId().optional()
}).required();
