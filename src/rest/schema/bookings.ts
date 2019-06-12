import {joi, ObjectId} from "./common";

export const CreateBookingRequestSchema = joi.object({
    start_time: joi.date().required(),
    end_time: joi.date().required(),
    bike: ObjectId().required(),
    user: ObjectId().optional()
})
    .rename("start_time", "startTime")
    .rename("end_time", "endTime")
    .required();
