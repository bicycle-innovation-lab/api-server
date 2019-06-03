import {arrayProp, instanceMethod, prop, Ref, Typegoose} from "typegoose";
import * as Mongoose from "mongoose";
import * as IsEmail from "isemail";
import {issueSessionToken} from "../auth/token";
import {compare, hash} from "../auth/hash";
import {getRoleLevel, Role} from "../auth/role";
import {Booking} from "./booking";
import {cleanMongooseDocument} from "./utils";
import {Image} from "./image";

export class User extends Typegoose {
    @prop({required: true})
    firstName!: string;

    @prop({required: true})
    lastName!: string;

    @prop({required: true, unique: true, validate: IsEmail.validate})
    email!: string;

    @prop({required: true})
    phone!: string;

    @arrayProp({itemsRef: Booking, default: []})
    bookings!: Ref<Booking>[];

    @prop({required: true})
    passwordHash!: string;

    @prop({required: true, enum: Role})
    role!: Role;

    /**
     * Session tokens issued before this should not be considered valid. This value is updated, for example, when the
     * users password changes. This causes all session tokens issued with the old password to become invalid.
     */
    @prop({required: true, default: new Date(0)})
    tokensNotBefore!: Date;

    @prop({required: false, ref: Image})
    avatar!: Ref<Image>;

    @prop()
    get authLevel() {
        return getRoleLevel(this.role);
    }

    @instanceMethod
    issueToken(this: UserDocument) {
        return issueSessionToken(this.id);
    }

    @instanceMethod
    comparePassword(password: string) {
        return compare(this.passwordHash, password);
    }

    @instanceMethod
    async setPassword(password: string) {
        this.passwordHash = await hash(password);
        this.tokensNotBefore = new Date(Date.now());
    }

    @instanceMethod
    toCleanObject(this: UserDocument) {
        return cleanMongooseDocument(this.toObject({
            transform(doc, ret) {
                // pick values that can be exposed to clients
                const {
                    firstName,
                    lastName,
                    email,
                    phone,
                    bookings,
                    role,
                    avatar
                } = ret;
                return {firstName, lastName, email, phone, bookings, role, avatar};
            }
        }));
    }
}

export const UserModel = new User().getModelForClass(User);
export type UserDocument = User & Mongoose.Document;
