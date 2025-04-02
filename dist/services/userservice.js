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
const userrepository_1 = __importDefault(require("../repository/userrepository"));
const appError_1 = require("../utils/response/appError");
const errorCodes_1 = require("../utils/response/errorCodes");
const statusCodes_1 = require("../utils/response/statusCodes");
const verificationrepository_1 = __importDefault(require("../repository/verificationrepository"));
const date_1 = require("../utils/date/date");
const collegeservice_1 = __importDefault(require("./collegeservice"));
class UserServices {
    signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = data;
            try {
                const emailCheck = yield userrepository_1.default.isEmailExists(email);
                if (emailCheck) {
                    throw new appError_1.AppError("Email already exists", statusCodes_1.HttpStatusCode.CONFLICT, errorCodes_1.ErrorCode.ALREADY_EXISTS);
                }
                const response = yield userrepository_1.default.create(data);
                const userId = response === null || response === void 0 ? void 0 : response._id;
                const verificationCode = yield verificationrepository_1.default.create({
                    userId,
                    type: "EMAIL_VERIFICATION" /* VerificationEnum.EMAIL_VERIFICATION */,
                    expiresAt: (0, date_1.fourtyFiveMinutesFromNow)(),
                });
                if (!response) {
                    throw new appError_1.AppError("Failed to create user", statusCodes_1.HttpStatusCode.BAD_REQUEST);
                }
                return response;
            }
            catch (error) {
                throw new appError_1.AppError(error.message, statusCodes_1.HttpStatusCode.INTERNAL_SERVER_ERROR, errorCodes_1.ErrorCode.SERVICE_UNAVAILABLE, false, error);
            }
        });
    }
    signin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            try {
                const response = yield userrepository_1.default.findOne(email, undefined, "college");
                if (!response) {
                    throw new appError_1.AppError("User not found", statusCodes_1.HttpStatusCode.NOT_FOUND, errorCodes_1.ErrorCode.NOT_FOUND, true);
                }
                const passwordCheck = yield response.comparePassword(password);
                if (!passwordCheck) {
                    throw new appError_1.AppError("Password is incorrect", statusCodes_1.HttpStatusCode.BAD_REQUEST, errorCodes_1.ErrorCode.INVALID_PASSWORD);
                }
                const userId = response._id;
                // const session = await sessionrepository.create({
                //   userId,
                //   userAgent,
                // });
                return { _id: response._id, user: response };
            }
            catch (error) {
                throw new appError_1.AppError(error.message, statusCodes_1.HttpStatusCode.INTERNAL_SERVER_ERROR, errorCodes_1.ErrorCode.SERVICE_UNAVAILABLE, false, error);
            }
        });
    }
    update_location(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated_user = yield userrepository_1.default.findById(user);
            if (!updated_user) {
                throw new appError_1.AppError("User not found", statusCodes_1.HttpStatusCode.NOT_FOUND);
            }
            updated_user.location = { type: "Point", coordinates: data.coordinates };
            yield updated_user.save();
            return updated_user;
        });
    }
    get_location(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const the_user = yield userrepository_1.default.findById(user);
            if (!the_user) {
                throw new appError_1.AppError("user not found", statusCodes_1.HttpStatusCode.NOT_FOUND);
            }
            const location = (_a = the_user === null || the_user === void 0 ? void 0 : the_user.location) === null || _a === void 0 ? void 0 : _a.coordinates;
            return location;
        });
    }
    get_profile(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userrepository_1.default.findById(user_id, undefined, undefined, "college");
            if (!user) {
                throw new appError_1.AppError("User not found", statusCodes_1.HttpStatusCode.NOT_FOUND);
            }
            return user;
        });
    }
    join_college(userId, collegeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.get_profile(userId);
            const college = yield collegeservice_1.default.getDetails(collegeId);
            if (!college) {
                throw new appError_1.AppError("College not found", statusCodes_1.HttpStatusCode.NOT_FOUND);
            }
            if (user.college) {
                throw new appError_1.AppError("User is already in college", statusCodes_1.HttpStatusCode.BAD_REQUEST);
            }
            user.college = collegeId;
            yield user.save();
            return user;
        });
    }
    exit_college(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.get_profile(userId);
            if (!user.college) {
                throw new appError_1.AppError("Not in college", statusCodes_1.HttpStatusCode.BAD_REQUEST);
            }
            user.college = null;
            yield user.save();
            return true;
        });
    }
}
exports.default = new UserServices();
