export default class ValidationError extends Error {
    expose = true;
    status = 422;
}