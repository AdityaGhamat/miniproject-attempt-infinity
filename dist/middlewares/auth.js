"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const appError_1 = require("../utils/response/appError");
const errorCodes_1 = require("../utils/response/errorCodes");
const logger_1 = require("../config/logger");
const session_1 = __importDefault(require("../lib/services/session"));
const AuthMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenFromCookie = req.cookies.session;
        const tokenFromHeader = req.headers.session;
        const token = tokenFromCookie || tokenFromHeader;
        if (!token) {
            throw new appError_1.AppError("No token provided", 401, errorCodes_1.ErrorCode.UNAUTHORIZED);
        }
        try {
            const decoded = yield session_1.default.decrypt(token);
            if (!decoded) {
                throw new appError_1.AppError("Invalid or expired session", 401, errorCodes_1.ErrorCode.UNAUTHORIZED);
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            logger_1.logger.warn({
                message: "Invalid token",
                context: "AuthMiddleware.requireAuth",
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw new appError_1.AppError("Unauthorized - Invalid token", 401, errorCodes_1.ErrorCode.INVALID_TOKEN);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.AuthMiddleware = AuthMiddleware;
