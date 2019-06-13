import {joi, Email, Password} from "../../schema/common";

export const SessionTokenRequestSchema = joi.object({
    email: Email().required(),
    password: Password().required()
}).required();

export const ResetPasswordTokenRequestSchema = joi.object({
    email: Email().required()
}).required();
