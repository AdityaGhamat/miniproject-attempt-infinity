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
const collegeservice_1 = __importDefault(require("../services/collegeservice"));
const asynchandler_1 = require("../middlewares/asynchandler");
const apiResponse_1 = require("../utils/response/apiResponse");
class CollegeController {
    constructor() {
        this.create = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { user_id } = req.query;
            if (!user_id) {
                apiResponse_1.ApiResponse.error(res, "user_id needs to pass in query to request");
            }
            const response = yield collegeservice_1.default.create(body, user_id);
            apiResponse_1.ApiResponse.success(res, response);
        }));
        this.getAllColleges = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const colleges = yield collegeservice_1.default.getAllColleges();
            apiResponse_1.ApiResponse.success(res, colleges);
        }));
        this.getDetails = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const response = yield collegeservice_1.default.getDetails(id);
            apiResponse_1.ApiResponse.success(res, response);
        }));
        this.updateCollege = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const college = req.body;
            const response = yield collegeservice_1.default.updateCollege(id, college);
            apiResponse_1.ApiResponse.success(res, response);
        }));
        this.deleteCollege = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const response = yield collegeservice_1.default.deleteCollege(id);
            apiResponse_1.ApiResponse.success(res, response);
        }));
        this.showCollegeStaff = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const response = yield collegeservice_1.default.showStaff(id);
            apiResponse_1.ApiResponse.success(res, response);
        }));
    }
}
exports.default = new CollegeController();
