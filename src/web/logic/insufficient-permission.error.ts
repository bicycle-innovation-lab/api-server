import {AuthLevel} from "../../auth/role";

export default class InsufficientPermissionError extends Error {
    expose = true;
    status = 403;

    readonly requiredPermission: AuthLevel;
    readonly actualPermission: AuthLevel;

    constructor(required: AuthLevel, actual: AuthLevel, message?: string) {
        super(message || "User has insufficient permissions");

        this.requiredPermission = required;
        this.actualPermission = actual;
    }
}