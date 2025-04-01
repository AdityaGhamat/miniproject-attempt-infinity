"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.errorHandler = void 0;
const statusCodes_1 = require("../utils/response/statusCodes");
const errorHandler = (error, req, res, _next) => {
    console.error(`Error Occured on path ${req.path} : ${error}`);
    if (error instanceof SyntaxError) {
        return res.status(statusCodes_1.HttpStatusCode.BAD_REQUEST).json({
            message: "Invalid JSON format, please check your request body.",
        });
    }
    return res.status(statusCodes_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: (error === null || error === void 0 ? void 0 : error.message) || "Unknown error occured",
    });
};
exports.errorHandler = errorHandler;
const errorMiddleware = (err, req, res, _next) => {
    (0, exports.errorHandler)(err, req, res, _next);
};
exports.errorMiddleware = errorMiddleware;
