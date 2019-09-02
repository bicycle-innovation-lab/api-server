import * as Koa from "koa";
import {User, UserDocument} from "../../db/user";
import {AuthLevel, getRoleLevel, Role} from "../../auth/role";
import {ObjectId} from "../schema/common";
import InsufficientPermissionError from "./insufficient-permission.error";
import IncorrectPasswordError from "./incorrect-password.error";
import {Filter} from "../../db/controller/filter";

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
        : await ctx.state.db.users.find(id);
}

interface ListUsersOptions {
    filter?: Filter<User>;
}

export async function listUsers(ctx: Koa.Context, opts: ListUsersOptions = {}): Promise<UserDocument[]> {
    const user = await ctx.state.getUser();
    if (!user) {
        return [];
    }
    if (user.authLevel < AuthLevel.Manager) {
        return [user];
    } else {
        return await ctx.state.db.users.list(opts.filter);
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

    const user = ctx.state.db.users.newDocument(opts);
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
        : await ctx.state.db.users.find(opts.id);

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

    // invalidate all old tokens when email changes
    if (opts.email) {
        user.email = opts.email;
        user.invalidateTokens();
    }

    user.firstName = opts.firstName || user.firstName;
    user.lastName = opts.lastName || user.lastName;
    user.phone = opts.phone || user.phone;

    await user.save();

    return user;
}

export async function resetUserPassword(ctx: Koa.Context, password: string): Promise<void> {
    const subject = await ctx.state.getSubject();
    await subject.setPassword(password);
    await subject.save();
}
