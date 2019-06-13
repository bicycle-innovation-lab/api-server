export default class InvalidReferenceError extends Error {
    expose = true;
    status = 422;
}