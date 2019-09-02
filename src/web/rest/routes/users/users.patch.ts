import * as Koa from "koa";
import {TokenType} from "../../../../auth/token";
import {ResetPasswordRequestSchema, PatchUserRequestSchema} from "../../schema/users";
import * as Logic from "../../../logic/users";
import {resetUserPassword} from "../../../logic/users";

const PatchUser: Koa.Middleware = async ctx => {
    const {id} = ctx.params;
    if (ctx.state.authType === TokenType.PasswordReset) {
        const {password} = await ctx.validateBody(ResetPasswordRequestSchema);
        await resetUserPassword(ctx, password);
        ctx.status = 200;
        return;
    } else {
        const form = await ctx.validateBody(PatchUserRequestSchema);
        if (form.password) {
            form.password = {
                current: form.currentPassword,
                new: form.password
            };
        }
        form.id = id;
        const user = await Logic.updateUser(ctx, form);
        if (!user) {
            return ctx.throw(404);
        }
        ctx.status = 200;
        return user;
    }
};

export default PatchUser;
