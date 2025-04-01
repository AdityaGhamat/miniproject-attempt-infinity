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
const userrepository_1 = __importDefault(require("../repository/userrepository"));
const appError_1 = require("../utils/response/appError");
const statusCodes_1 = require("../utils/response/statusCodes");
const collegeservice_1 = __importDefault(require("./collegeservice"));
const date_fns_1 = require("date-fns");
class AdminService {
    findMembers(college_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const college_coordinates = yield collegeservice_1.default.getCollegeLocation(college_id);
            const radiusInMeters = 130;
            const radiusInRadians = radiusInMeters / 6371000;
            const members = yield userrepository_1.default.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [college_coordinates, radiusInRadians],
                    },
                },
            });
            console.log(members); //remove this console later.
            if (!members || members.length === 0) {
                throw new appError_1.AppError("Failed to find any members", statusCodes_1.HttpStatusCode.NOT_FOUND);
            }
            const today = new Date();
            for (const member of members) {
                const existingAttendance = yield attendancerepository_1.default.findOne({
                    user: member._id,
                    date: { $gte: (0, date_fns_1.startOfDay)(today), $lte: (0, date_fns_1.endOfDay)(today) },
                });
                if (!existingAttendance) {
                    yield attendancerepository_1.default.create({
                        user: member._id,
                        date: today,
                        checkIn: new Date(),
                        college: member.college,
                        isPresent: true,
                        location: {
                            type: "Point",
                            coordinates: member.location.coordinates,
                        },
                    });
                }
            }
            return members;
        });
    }
}
exports.default = new AdminService();
