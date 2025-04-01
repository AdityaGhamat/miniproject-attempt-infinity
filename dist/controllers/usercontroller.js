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
const userservice_1 = __importDefault(require("../services/userservice"));
const session_1 = __importDefault(require("../lib/services/session"));
const apiResponse_1 = require("../utils/response/apiResponse");
const asynchandler_1 = require("../middlewares/asynchandler");
class UserController {
    constructor() {
        this.signup = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const response = yield userservice_1.default.signup(data);
            const new_session = yield session_1.default.createSession(response._id, res);
            apiResponse_1.ApiResponse.success(res, { token: new_session, user: response }, "User signup successful.");
        }));
        this.signIn = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const response = yield userservice_1.default.signin(data);
            const user = response.user;
            const new_session = yield session_1.default.createSession(response._id, res);
            apiResponse_1.ApiResponse.success(res, { new_session, user }, "User signin successful.");
        }));
        this.updateLocation = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const { userId } = user;
            const data = req.body;
            const response = yield userservice_1.default.update_location(userId, data);
            apiResponse_1.ApiResponse.success(res, response, "updated location");
        }));
        this.getLocation = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = req.user.userId;
            const response = yield userservice_1.default.get_location(user);
            apiResponse_1.ApiResponse.success(res, response, "location has been fetched");
        }));
        this.getProfile = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield userservice_1.default.get_profile(id);
            apiResponse_1.ApiResponse.success(res, user, "profile has been found");
        }));
        this.joinCollege = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { collegeId } = req.params;
            const userId = req.user.userId;
            const response = yield userservice_1.default.join_college(userId, collegeId);
            apiResponse_1.ApiResponse.success(res, response, "college has been joined");
        }));
        this.exitCollege = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.userId;
            const response = yield userservice_1.default.exit_college(userId);
            apiResponse_1.ApiResponse.success(res, response, "Exited the college");
        }));
    }
}
exports.default = new UserController();
