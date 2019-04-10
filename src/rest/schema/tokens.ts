import {joi, Email, Password} from "./common";

export const TokensRequestSchema = joi.object({
    email: Email().required(),
    password: Password().required()
});
