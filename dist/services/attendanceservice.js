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
const attendancerepository_1 = __importDefault(require("../repository/attendancerepository"));
const date_fns_1 = require("date-fns");
class AttendanceService {
    viewAttendanceOfToday(collegeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const attendanceLogs = yield attendancerepository_1.default.find({
                college: collegeId,
                date: { $gte: (0, date_fns_1.startOfDay)(today), $lte: (0, date_fns_1.endOfDay)(today) },
            }, {
                populate: ["user", "college"],
            });
            return attendanceLogs;
        });
    }
    viewAttendance(collegeId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fromDate, toDate, staffId, status, minHours, maxHours } = filters;
            const query = { college: collegeId };
            if (fromDate && toDate) {
                query.date = { $gte: new Date(fromDate), $lte: new Date(toDate) };
            }
            if (staffId) {
                query.user = staffId;
            }
            if (status === "present") {
                query.isPresent = true;
            }
            else if (status === "absent") {
                query.isPresent = false;
            }
            if (minHours || maxHours) {
                query.workingHours = {};
                if (minHours)
                    query.workingHours.$gte = minHours;
                if (maxHours)
                    query.workingHours.$lte = maxHours;
            }
            return attendancerepository_1.default.find(query, { populate: ["user", "college"] });
        });
    }
}
exports.default = new AttendanceService();
