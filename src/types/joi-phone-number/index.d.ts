import * as Joi from "joi";

declare const JoiPhoneNumber: Joi.Extension;
export = JoiPhoneNumber;

declare module "joi" {
    interface StringSchema {
        phoneNumber(opts?: PhoneNumberOptions): this;
    }

    interface PhoneNumberOptions {
        defaultCountry?: string;
        format?: string;
    }
}