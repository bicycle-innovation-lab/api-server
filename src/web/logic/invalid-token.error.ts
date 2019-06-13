export default class InvalidTokenError extends Error {
    expose = true;
    headers = {
        'WWW-Authenticate': "Bearer"
    };
    status = 401;
}
