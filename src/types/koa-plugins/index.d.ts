import {AuthLevel} from "../../auth/role";

declare module "koa" {
    interface BaseContext {
        /**
         * Only returns when the currently signed in user has sufficient permissions. Throws the appropriate error when the
         * request unauthenticated, or has insufficient permissions.
         */
        testPermission(level: AuthLevel): Promise<any>
    }
}
