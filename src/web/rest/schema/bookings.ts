import {dateFilter, joi, ObjectId} from "../../schema/common";

export const CreateBookingRequestSchema = joi.object({
    startTime: joi.date().required(),
    endTime: joi.date().required(),
    bike: ObjectId().required(),
    user: ObjectId().optional()
})
    .rename("start_time", "startTime")
    .rename("end_time", "endTime")
    .required();

export const BookingFilterSchema = joi.object({
    startTime: dateFilter(),
    endTime: dateFilter()
});
