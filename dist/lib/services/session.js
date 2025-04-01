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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../../utils/response/appError");
const errorCodes_1 = require("../../utils/response/errorCodes");
class Session {
    constructor() {
        this.secretKey = process.env.SECRET_KEY || "default_secret_key";
        this.cookieOptions = {
            name: "session",
            options: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            },
            duration: 24 * 60 * 60 * 1000,
        };
    }
    encrypt(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return jsonwebtoken_1.default.sign(payload, this.secretKey, {
                    algorithm: "HS256",
                    expiresIn: "1d",
                });
            }
            catch (error) {
                throw new appError_1.AppError("Failed to encrypt session", 500, errorCodes_1.ErrorCode.INTERNAL_SERVER_ERROR);
            }
        });
    }
    decrypt(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, this.secretKey, {
                    algorithms: ["HS256"],
                });
                return decoded;
            }
            catch (error) {
                throw new appError_1.AppError("Invalid or expired session", 401, errorCodes_1.ErrorCode.UNAUTHORIZED);
            }
        });
    }
    createSession(userId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expires = Date.now() + this.cookieOptions.duration;
                const session = yield this.encrypt({ userId, expires });
                res.cookie(this.cookieOptions.name, session, Object.assign(Object.assign({}, this.cookieOptions.options), { maxAge: this.cookieOptions.duration }));
                return session;
            }
            catch (error) {
                throw new appError_1.AppError("Failed to create session", 500, errorCodes_1.ErrorCode.INTERNAL_SERVER_ERROR);
            }
        });
    }
    verifySession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const cookie = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[this.cookieOptions.name];
                if (!cookie) {
                    throw new appError_1.AppError("Session cookie not found", 404, errorCodes_1.ErrorCode.NOT_FOUND);
                }
                const session = yield this.decrypt(cookie);
                if (!session || !session.userId) {
                    throw new appError_1.AppError("Invalid or expired session", 401, errorCodes_1.ErrorCode.UNAUTHORIZED);
                }
                return session.userId;
            }
            catch (error) {
                throw error instanceof appError_1.AppError
                    ? error
                    : new appError_1.AppError("Session verification failed", 500, errorCodes_1.ErrorCode.INTERNAL_SERVER_ERROR);
            }
        });
    }
    deleteSession(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie(this.cookieOptions.name);
            }
            catch (error) {
                throw new appError_1.AppError("Failed to delete session", 500, errorCodes_1.ErrorCode.INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.default = new Session();
