import * as JWT from "jsonwebtoken";

export const Secret = process.env.JWT_SECRET as string;
if (!Secret) {
    console.warn("No JWT secret provided!");
}

enum TokenType {
    Session = "sess",
    PasswordReset = "pr",
}

function issueToken(subject: string, expiresIn: string, type: TokenType, payload: any = {}): Promise<string> {
    return new Promise((resolve, reject) =>
        JWT.sign({type, ...payload}, Secret, {subject, expiresIn}, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        })
    );
}

/** Verifies that the given token is valid, and is of the expected type */
function verifyToken(token: string, type: TokenType): Promise<any> {
    return new Promise((resolve, reject) => {
        JWT.verify(token, Secret, (err, decoded: any) => {
            if (err) {
                reject(err);
            } else {
                if (decoded.type === type) {
                    resolve(decoded);
                } else {
                    resolve({});
                }
            }
        })
    });
}

/** Issues a new token for the given user. The token will be valid for 1 year. */
export function issueSessionToken(subject: string): Promise<string> {
    return issueToken(subject, "1y", TokenType.Session);
}

/** Verifies the given token, and returns the ID of the user it was issued to. */
export async function verifySessionToken(token: string): Promise<string | undefined> {
    const payload = await verifyToken(token, TokenType.Session);
    return payload.sub;
}

/**
 * Issues a token that can change a users password without confirming their current one. The token is only valid for
 * one hour.
 */
export function issuePasswordResetToken(subject: string): Promise<string> {
    return issueToken(subject, "1h", TokenType.PasswordReset);
}

/** Verifies the given token, and returns the ID of the user it was issued for. */
export async function verifyPasswordResetToken(token: string): Promise<string | undefined> {
    const payload = await verifyToken(token, TokenType.PasswordReset);
    return payload.sub;
}
