"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.ValidationError = exports.ErrorHandler = void 0;
const appError_1 = require("./appError");
const logger_1 = require("../../config/logger");
const errorCodes_1 = require("./errorCodes");
class ErrorHandler {
    static handle(error, context) {
        if (error instanceof appError_1.AppError) {
            logger_1.logger.warn("Application error occurred", {
                message: error.message,
                context,
                code: error.code,
                statusCode: error.statusCode,
                details: error.details,
                stack: error.stack,
            });
            return error;
        }
        const unknownError = new appError_1.AppError("Internal server error", 500, errorCodes_1.ErrorCode.INTERNAL_SERVER_ERROR, false);
        logger_1.logger.error("Unknown error occurred", {
            message: error instanceof Error ? error.message : "Unknown error",
            context,
            error: error instanceof Error ? error.stack : JSON.stringify(error),
            details: error instanceof Error ? error : undefined,
        });
        return unknownError;
    }
}
exports.ErrorHandler = ErrorHandler;
class ValidationError extends appError_1.AppError {
    constructor(message) {
        super(message, 400, errorCodes_1.ErrorCode.VALIDATION_ERROR);
    }
}
exports.ValidationError = ValidationError;
class DatabaseError extends appError_1.AppError {
    constructor(message) {
        super(message, 500, errorCodes_1.ErrorCode.DB_ERROR);
    }
}
exports.DatabaseError = DatabaseError;
