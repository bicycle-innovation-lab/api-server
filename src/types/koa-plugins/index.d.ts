import {AuthLevel} from "../../auth/role";

declare module "koa" {
    interface BaseContext {
        testPermission(level: AuthLevel): Promise<any>
    }
}
