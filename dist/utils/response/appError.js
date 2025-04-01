"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAppError = exports.AppError = void 0;
const errorCodes_1 = require("./errorCodes");
class AppError extends Error {
    constructor(message, statusCode = 500, code = errorCodes_1.ErrorCode.INTERNAL_SERVER_ERROR, isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const isAppError = (error) => {
    return error instanceof AppError;
};
exports.isAppError = isAppError;
