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
exports.AdminMiddleware = void 0;
const userservice_1 = __importDefault(require("../services/userservice"));
const user_enum_1 = require("../types/enums/user-enum");
const statusCodes_1 = require("../utils/response/statusCodes");
const apiResponse_1 = require("../utils/response/apiResponse");
const AdminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const user = yield userservice_1.default.get_profile(userId);
    if (user.role !== user_enum_1.UserEnumType.ADMIN) {
        apiResponse_1.ApiResponse.error(res, "You are not admin", statusCodes_1.HttpStatusCode.UNAUTHORIZED);
    }
    next();
});
exports.AdminMiddleware = AdminMiddleware;
