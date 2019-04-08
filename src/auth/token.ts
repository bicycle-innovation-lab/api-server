import * as Mongoose from "mongoose";
import * as JWT from "jsonwebtoken";
import {User} from "../db/user";

export const Secret = process.env.JWT_SECRET as string;
if (!Secret) {
    console.warn("No JWT secret provided!");
}

/** Issues a new token for the given user. The token will be valid for 1 year. */
export function issueToken(subject: string): Promise<string> {
    return new Promise((resolve, reject) =>
        JWT.sign({}, Secret, {subject, expiresIn: "1y"}, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        })
    );
}

/** Verifies the given token, and returns the ID of the user it was issued to. */
export function verifyToken(token: string): Promise<string> {
    return new Promise((resolve, reject) =>
        JWT.verify(token, Secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve((decoded as any).sub);
            }
        })
    );
}
