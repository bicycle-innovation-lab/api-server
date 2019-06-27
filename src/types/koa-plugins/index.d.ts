import * as Joi from "joi";
import {AuthLevel} from "../../auth/role";
import {UserDocument} from "../../db/user";
import {TokenType} from "../../auth/token";
import {BikeController} from "../../db/bike";
import {BookingController} from "../../db/booking";
import {CategoryController} from "../../db/category";
import {ImageController} from "../../db/image";
import {UserController} from "../../db/user";

declare module "koa" {
    interface BaseContext {
        /**
         * Only returns when the currently signed in user has sufficient permissions. Throws the appropriate error when the
         * request unauthenticated, or has insufficient permissions.
         */
        testPermission(level: AuthLevel): Promise<any>

        validate(schema: Joi.Schema, doc: any): any;
        validateBody(schema: Joi.Schema): Promise<any>;
        validateQuery(schema: Joi.Schema, query: string): any;

        state: {
            /** Returns the currently signed in user of the current session. */
            getUser(): Promise<UserDocument | undefined>;
            /** Returns the subject of the current authentication token. */
            getSubject(): Promise<UserDocument | undefined>
            authType: TokenType;
            authenticated: boolean;
            /** Whether the current authentication is a user session. */
            session: boolean;

            db: {
                bikes: typeof BikeController;
                bookings: typeof BookingController;
                categories: typeof CategoryController;
                images: typeof ImageController;
                users: typeof UserController;
            }
        }
    }
}
