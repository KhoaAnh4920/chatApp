import {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} from 'http-status-codes';

const ERROR_CODE = {
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    PARAM_INVALID: 'PARAM_INVALID',
    UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_OTP: 'INVALID_OTP',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
}



const ErrorList = {
    [ERROR_CODE.INTERNAL_SERVER_ERROR]: {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
    },
    [ERROR_CODE.USER_NOT_FOUND]: {
        statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
        message: 'User not found',
    },
    [ERROR_CODE.UNAUTHORIZED]: {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid email or password',
    },
    [ERROR_CODE.INVALID_OTP]: {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Invalid OTP',
    },
}

export { ERROR_CODE, ErrorList };