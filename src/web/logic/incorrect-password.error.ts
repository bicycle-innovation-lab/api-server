export default class IncorrectPasswordError extends Error {
    expose = true;
    status = 403;

    constructor() {
        super("Incorrect password");
    }
}
