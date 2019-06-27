import * as Mongoose from "mongoose";
import {cleanDocument, ObjectId, prop, Reference} from "./utils";
import {BookingDocument} from "./booking";
import {ImageDocument} from "./image";
import {allRoles, AuthLevel, getRoleLevel, Role} from "../auth/role";
import {model, schema} from "./schema";
import {def, inEnum, ref, required, unique} from "./modifiers";
import {issueSessionToken} from "../auth/token";
import {compare, hash} from "../auth/hash";
import Controller, {SlimDocument} from "./controller";

export interface User extends SlimDocument {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bookings: Reference<BookingDocument>[];
    passwordHash: string;
    role: Role;
    /**
     * Session tokens issued before this should not be considered valid. This value is updated, for example, when the
     * users password changes. This causes all session tokens issued with the old password to become invalid.
     */
    tokensNotBefore: Date;
    avatar: Reference<ImageDocument>;

    readonly authLevel: AuthLevel;

    issueToken(this: UserDocument): Promise<string>;

    comparePassword(this: UserDocument, password: string): Promise<boolean>;

    setPassword(this: UserDocument, password: string): Promise<void>;
}

const userSchema = schema<User>({
    firstName: prop(String, [required]),
    lastName: prop(String, [required]),
    email: prop(String, [required, unique]),
    phone: prop(String, [required]),
    bookings: [prop(ObjectId, [ref("image")])],
    passwordHash: prop(String, [required]),
    role: prop(String, [required, inEnum(allRoles)]),
    tokensNotBefore: prop(Date, [required, def(new Date(0))]),
    avatar: prop(ObjectId, [ref("image")])
}, {
    toJSON: {
        versionKey: false,
        transform(doc, ret) {
            const {passwordHash, tokensNotBefore, ...clean} = cleanDocument(ret);
            return clean;
        }
    }
});
export type UserDocument = User & Mongoose.Document;

export const UserController = Controller(
    "user",
    userSchema,
    {
        instanceMethods: {
            issueToken(): Promise<string> {
                return issueSessionToken(this.id);
            },
            comparePassword(password: string): Promise<boolean> {
                return compare(this.passwordHash, password);
            },
            async setPassword(password: string): Promise<void> {
                this.passwordHash = await hash(password);
                this.tokensNotBefore = new Date(Date.now());
            }
        },
        virtuals: {
            get authLevel(this: UserDocument): AuthLevel {
                return getRoleLevel(this.role);
            }
        }
    }
);