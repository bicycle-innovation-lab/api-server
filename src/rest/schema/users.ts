import {Role as Roles} from "../../auth/role";
import {joi, Email, Password, Phone, Role} from "./common";

export const CreateUserRequestSchema = joi.object({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    email: Email().required(),
    phone: Phone().required(),
    password: Password().required(),
    role: Role().default(Roles.User).optional()
});
