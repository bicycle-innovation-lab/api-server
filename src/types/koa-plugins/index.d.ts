import * as Joi from "joi";
import {AuthLevel} from "../../auth/role";
import {User} from "../../db/user";

declare module "koa" {

    interface BaseContext {
        /**
         * Only returns when the currently signed in user has sufficient permissions. Throws the appropriate error when the
         * request unauthenticated, or has insufficient permissions.
         */
        testPermission(level: AuthLevel): Promise<any>

        validate(schema: Joi.Schema, doc: any): any;
        validateBody(schema: Joi.Schema): Promise<any>;

        state: {
            /** Returns the currently signed in user, or undefined. */
            getUser(): Promise<User | undefined>;
        }
    }
}
