import * as BCrypt from "bcrypt";

const SaltRounds = process.env.BCRYPT_SALT_ROUNDS || 5;

export function hash(data: string) {
    return BCrypt.hash(data, SaltRounds);
}

export function compare(hash: string, data: string) {
    return BCrypt.compare(data, hash);
}
