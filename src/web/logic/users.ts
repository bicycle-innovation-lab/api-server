import * as Koa from "koa";
import {User, UserDocument, UserModel} from "../../db/user";
import {AuthLevel, getRoleLevel, Role} from "../../auth/role";
import {ObjectId} from "../../rest/schema/common";
import InsufficientPermissionError from "./insufficient-permission.error";
import IncorrectPasswordError from "./incorrect-password.error";

/**
 * Tests if the currently signed in user can see the given user id. Returns true if the signed in user is manager or
 * higher. If the signed in user is just a normal user, then only returns true if id is 'me'.
 */
export async function canSeeUser(id: string, ctx: Koa.Context): Promise<boolean> {
    const signedIn = await ctx.state.getUser();
    if (!signedIn) {
        return false;
    }
    if (id !== "me") {
        if (signedIn.authLevel < AuthLevel.Manager) {
            return false;
        }
    }
    return true;
}

export async function getUser(ctx: Koa.Context, id: string): Promise<UserDocument | undefined> {
    if (!await canSeeUser(id, ctx)) {
        return undefined;
    }
    if (id !== "me" && ObjectId().validate(id).error) {
        return undefined;
    }

    return id === "me"
        ? await ctx.state.getUser()
        : await UserModel.findOne({_id: id});
}

export async function listUsers(ctx: Koa.Context): Promise<UserDocument[]> {
    const user = await ctx.state.getUser();
    if (!user) {
        return [];
    }
    if (getRoleLevel(user.role) < AuthLevel.Manager) {
        return [user];
    } else {
        return await UserModel.find();
    }
}

export interface UserCreationOptions {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
    avatar?: string;
}

export class EmailCollisionError extends Error {
    expose = true;
    status = 422;

    constructor(email: string) {
        super(`User with email "${email}" already exists`);
    }
}

export async function createUser(ctx: Koa.Context, opts: UserCreationOptions): Promise<UserDocument> {
    // only admins can assign a role to a new user
    if (getRoleLevel(opts.role) > AuthLevel.User) {
        await ctx.testPermission(AuthLevel.Admin);
    }

    const user = new UserModel(opts);
    await user.setPassword(opts.password);

    try {
        await user.save();
    } catch (err) {
        if (err.code == 11000) {
            throw new EmailCollisionError(opts.email);
        } else {
            throw err;
        }
    }

    return user;
}

export interface UserUpdateOptions {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: {
        current: string;
        new: string;
    }
    role?: Role;
    avatar?: string;
}

export async function updateUser(ctx: Koa.Context, opts: UserUpdateOptions): Promise<UserDocument | undefined> {
    if (!await canSeeUser(opts.id, ctx)) {
        return undefined;
    }

    const isMe = opts.id === "me";
    const signedIn = await ctx.state.getUser();
    const user = isMe
        ? signedIn
        : await UserModel.findOne({_id: opts.id});

    if (!user) {
        return undefined;
    }

    // only admins can change user roles
    if (opts.role) {
        if (signedIn.authLevel < AuthLevel.Admin) {
            throw new InsufficientPermissionError(AuthLevel.Admin, signedIn.authLevel);
        }
        user.role = opts.role;
    }

    // users can only change their password if they supply their current password
    if (opts.password && isMe) {
        if (!await signedIn.comparePassword(opts.password.current)) {
            throw new IncorrectPasswordError();
        }
        await user.setPassword(opts.password.new);
    }
    user.firstName = opts.firstName || user.firstName;
    user.lastName = opts.lastName || user.lastName;
    user.email = opts.email || user.email;
    user.phone = opts.phone || user.phone;

    await user.save();

    return user;
}

export async function resetUserPassword(ctx: Koa.Context, password: string): Promise<void> {
    const subject = await ctx.state.getSubject();
    await subject.setPassword(password);
}
