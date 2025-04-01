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
const collegerepository_1 = __importDefault(require("../repository/collegerepository"));
const userrepository_1 = __importDefault(require("../repository/userrepository"));
const appError_1 = require("../utils/response/appError");
const statusCodes_1 = require("../utils/response/statusCodes");
class CollegeService {
    create(data, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield collegerepository_1.default.create(data);
            if (!response) {
                throw new appError_1.AppError("Failed to create college", statusCodes_1.HttpStatusCode.BAD_REQUEST);
            }
            const updatedUser = yield userrepository_1.default.findByIdAndUpdate(user_id, {
                college: response._id,
            });
            if (!updatedUser) {
                throw new appError_1.AppError("Failed to update College in user", statusCodes_1.HttpStatusCode.BAD_REQUEST);
            }
            return response;
        });
    }
    getAllColleges() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield collegerepository_1.default.find({});
            if (!response || response.length == 0) {
                throw new appError_1.AppError("Colleges not found", statusCodes_1.HttpStatusCode.NOT_FOUND);
            }
            return response;
        });
    }
    getDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield collegerepository_1.default.findById(id);
            if (!response) {
                throw new appError_1.AppError("Failed to find college", statusCodes_1.HttpStatusCode.BAD_REQUEST);
            }
            return response;
        });
    }
    updateCollege(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const college = yield collegerepository_1.default.findById(id);
            if (!college) {
                throw new appError_1.AppError("Failed to find college", statusCodes_1.HttpStatusCode.BAD_REQUEST);
            }
            const response = yield collegerepository_1.default.findByIdAndUpdate(id, data);
            if (!response) {
                throw new appError_1.AppError("Failed to update college.", statusCodes_1.HttpStatusCode.BAD_REQUEST);
            }
            return response;
        });
    }
    deleteCollege(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const college = yield collegerepository_1.default.findById(id);
            if (!college) {
                throw new appError_1.AppError("Failed to find college", statusCodes_1.HttpStatusCode.BAD_REQUEST);
            }
            const response = yield collegerepository_1.default.findByIdAndDelete(id);
            if (!response) {
                throw new appError_1.AppError("Failed to delete college.", statusCodes_1.HttpStatusCode.BAD_REQUEST);
            }
            return response;
        });
    }
    getCollegeLocation(collegeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const college = yield collegerepository_1.default.findById(collegeId);
            if (!college) {
                throw new appError_1.AppError("Failed to find college", statusCodes_1.HttpStatusCode.BAD_REQUEST);
            }
            const college_location = college === null || college === void 0 ? void 0 : college.location;
            const coordinates = college_location.coordinates;
            return coordinates;
        });
    }
    showStaff(collegeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const members = yield userrepository_1.default.find({ college: collegeId }, { populate: "college" });
            if (!members || members.length === 0) {
                throw new appError_1.AppError("Members not found", statusCodes_1.HttpStatusCode.NOT_FOUND);
            }
            return members;
        });
    }
}
exports.default = new CollegeService();
