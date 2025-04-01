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
const collegeservice_1 = __importDefault(require("./collegeservice"));
const date_fns_1 = require("date-fns");
class AdminService {
    findMembers(college_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const college_coordinates = yield collegeservice_1.default.getCollegeLocation(college_id);
            const radiusInMeters = 130;
            const radiusInRadians = radiusInMeters / 6371000;
            // Fetch all staff members
            const staffMembers = yield userrepository_1.default.find({ college: college_id });
            // Fetch members inside the college radius
            const presentMembers = yield userrepository_1.default.find({
                college: college_id,
                location: {
                    $geoWithin: {
                        $centerSphere: [college_coordinates, radiusInRadians],
                    },
                },
            });
            const today = new Date();
            const currentRoundMinutes = Math.floor((today.getHours() * 60 + today.getMinutes()) / 15) * 15;
            const currentRoundTime = new Date(today.setMinutes(currentRoundMinutes));
            for (const member of staffMembers) {
                const existingAttendance = yield attendancerepository_1.default.findOne({
                    user: member._id,
                    date: { $gte: (0, date_fns_1.startOfDay)(today), $lte: (0, date_fns_1.endOfDay)(today) },
                });
                const isCurrentlyPresent = presentMembers.some((present) => present._id.equals(member._id));
                if (existingAttendance) {
                    if (isCurrentlyPresent) {
                        // If user is now present, mark as present
                        existingAttendance.isPresent = true;
                        if (!existingAttendance.checkIn) {
                            existingAttendance.checkIn = new Date();
                        }
                        // Reset checkout time if user returns
                        existingAttendance.checkOut = null;
                    }
                    else {
                        // If user was previously present but is now absent
                        if (existingAttendance.isPresent) {
                            const timeDifference = (currentRoundTime.getTime() -
                                existingAttendance.currentRoundTime.getTime()) /
                                1000 /
                                60;
                            existingAttendance.workingHours =
                                (((_a = existingAttendance.workingHours) === null || _a === void 0 ? void 0 : _a.valueOf()) || 0) +
                                    timeDifference;
                            // Set checkout time
                            existingAttendance.checkOut = currentRoundTime;
                        }
                        existingAttendance.isPresent = false;
                    }
                    existingAttendance.currentRoundTime = currentRoundTime;
                    yield existingAttendance.save();
                }
                else {
                    // If no previous record, create a new one
                    yield attendancerepository_1.default.create({
                        user: member._id,
                        date: today,
                        checkIn: isCurrentlyPresent ? new Date() : undefined, // Ensure checkOut is null at the start
                        currentRoundTime: currentRoundTime,
                        college: member.college,
                        isPresent: isCurrentlyPresent,
                        workingHours: 0,
                        location: isCurrentlyPresent
                            ? {
                                type: "Point",
                                coordinates: member.location.coordinates,
                            }
                            : { type: "Point", coordinates: [0, 0] },
                    });
                }
            }
            return presentMembers;
        });
    }
}
exports.default = new AdminService();
