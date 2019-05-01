import * as Koa from "koa";
import {TokenType} from "../../../auth/token";
import {UserDocument, UserModel} from "../../../db/user";
import {ResetPasswordRequestSchema, UpdateUserRequestSchema} from "../../schema/users";
import {canSeeUser} from "./index";
import {AuthLevel} from "../../../auth/role";

const PutUsers: Koa.Middleware = async ctx => {
    const {id} = ctx.params;
    if (ctx.state.authType === TokenType.PasswordReset) {
        if (id !== "me") {
            ctx.throw(404);
        }
        const {password} = await ctx.validateBody(ResetPasswordRequestSchema);
        const user = await ctx.state.getSubject() as UserDocument;
        await user.setPassword(password);
        await user.save();
        return;
    }

    if (!await canSeeUser(id, ctx)) {
        ctx.throw(404);
    }
    const isMe = id === "me";
    const user = isMe
        ? await ctx.state.getUser() as UserDocument
        : await UserModel.findOne({id});
    if (!user) {
        return ctx.throw(404);
    }
    if (!isMe) {
        // managers can only edit User role users
        if (user.authLevel >= AuthLevel.Manager) {
            ctx.throw(403, "User has insufficient permissions")
        }
    }

    const form = await ctx.validateBody(UpdateUserRequestSchema);

    if (form.role) {
        // only admins can change user roles
        await ctx.testPermission(AuthLevel.Admin);
        user.role = form.role;
    }
    if (form.password && isMe) {
        if (!await user.comparePassword(form.current_password)) {
            ctx.throw(403, "Wrong current password");
        } else {
            await user.setPassword(form.password);
        }
    }
    user.firstName = form.first_name || user.firstName;
    user.lastName = form.last_name || user.lastName;
    user.email = form.email || user.email;
    user.phone = form.phone || user.phone;

    await user.save();
    ctx.status = 200;
    return user.toCleanObject();
};

export default PutUsers;
