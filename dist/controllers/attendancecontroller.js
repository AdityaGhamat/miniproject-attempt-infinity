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
const asynchandler_1 = require("../middlewares/asynchandler");
const adminservice_1 = __importDefault(require("../services/adminservice"));
const apiResponse_1 = require("../utils/response/apiResponse");
const attendanceservice_1 = __importDefault(require("../services/attendanceservice"));
class AttendanceController {
    constructor() {
        this.register = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { college_id } = req.params;
            const response = yield adminservice_1.default.findMembers(college_id);
            apiResponse_1.ApiResponse.success(res, response);
        }));
        this.viewTodaysAttendance = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { college_id } = req.params;
            const response = yield attendanceservice_1.default.viewAttendanceOfToday(college_id);
            apiResponse_1.ApiResponse.success(res, response);
        }));
        this.viewAttendance = (0, asynchandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { college_id } = req.params;
            const { fromDate, toDate, staffId, status, minHours, maxHours } = req.query;
            const response = yield attendanceservice_1.default.viewAttendance(college_id, {
                fromDate,
                toDate,
                staffId,
                status,
                minHours,
                maxHours,
            });
            apiResponse_1.ApiResponse.success(res, response);
        }));
    }
}
exports.default = new AttendanceController();
