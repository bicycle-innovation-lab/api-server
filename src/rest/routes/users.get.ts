import * as Koa from "koa";
import * as compose from "koa-compose";
import RequirePermission from "../middleware/require-permissions";
import {AuthLevel} from "../../auth/role";
import {UserModel} from "../../db/user";

const GetUsers: Koa.Middleware = compose([
    RequirePermission(AuthLevel.User),
    async ctx => {
        const {id} = ctx.params;
        if (id !== "me") {
            // only managers and up can get info about other users
            await ctx.testPermission(AuthLevel.Manager);
        }
        const user = id === "me"
            ? await ctx.state.getUser()
            : await UserModel.findOne({_id: id});
        if (!user) {
            ctx.throw(404);
        } else {
            return user.toCleanObject();
        }
    }
]);

export default GetUsers;
