"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, data = null, message = "Success") {
        res.status(200).json({
            success: true,
            message,
            data,
        });
    }
    static error(res, message, statusCode = 400, code) {
        res.status(statusCode).json(Object.assign({ success: false, message,
            code }, (process.env.NODE_ENV === "development" && {
            stack: new Error().stack,
        })));
    }
}
exports.ApiResponse = ApiResponse;
