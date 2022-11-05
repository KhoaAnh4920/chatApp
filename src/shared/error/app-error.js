import { ERROR_CODE, ErrorList } from './errorCodes';


export default class HttpError extends Error {
    constructor(message, code = null, status = null, stack = null, name = null) {
        super();
        this.message = message;
        this.status = status;

        this.name = name || this.constructor.name;
        this.code = code || `E_${this.name.toUpperCase()}`;
        this.stack = stack || null;
    }

    static fromObject(errorCode) {
        const errors = ErrorList[errorCode];
        // console.log('errorCode: ', errorCode)
        // console.log('errors: ', errors)
        // const message = errors.message;
        // const errorCode = errorCode;
        // const statusCode = errors.statusCode;

        if (errors instanceof HttpError) {
            return errors;
        } else {
            return new ClientError(errors.message, errorCode, errors.statusCode);
        }
    }

    expose() {
        if (this instanceof ClientError) {
            return {...this };
        } else {
            return {
                name: this.name,
                code: this.code,
                status: this.status,
            }
        }
    }
}

class ServerError extends HttpError {}

class ClientError extends HttpError {}

class IncorrectCredentials extends ClientError {
    constructor(...args) {
        super(...args);
        this.status = 400;
    }
}

class ResourceNotFound extends ClientError {
    constructor(...args) {
        super(...args);
        this.status = 404;
    }
}