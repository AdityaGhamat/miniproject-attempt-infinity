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
            const college_coordinates = yield collegeservice_1.default.getCollegeLocation(college_id);
            const radiusInMeters = 130;
            const radiusInRadians = radiusInMeters / 6371000;
            const staffMembers = yield userrepository_1.default.find({ college: college_id });
            const presentMembers = yield userrepository_1.default.find({
                college: college_id,
                location: {
                    $geoWithin: {
                        $centerSphere: [college_coordinates, radiusInRadians],
                    },
                },
            });
            const now = new Date(); // current UTC time
            // Round to the nearest 15-minute block in UTC
            const totalUTCMins = now.getUTCHours() * 60 + now.getUTCMinutes();
            const roundedMinutes = Math.floor(totalUTCMins / 15) * 15;
            const roundedUTCDate = new Date(now);
            const roundedHours = Math.floor(roundedMinutes / 60);
            const roundedMins = roundedMinutes % 60;
            roundedUTCDate.setUTCHours(roundedHours, roundedMins, 0, 0);
            for (const member of staffMembers) {
                const existingAttendance = yield attendancerepository_1.default.findOne({
                    user: member._id,
                    date: { $gte: (0, date_fns_1.startOfDay)(now), $lte: (0, date_fns_1.endOfDay)(now) },
                });
                const isCurrentlyPresent = presentMembers.some((present) => present._id.equals(member._id));
                if (existingAttendance) {
                    if (isCurrentlyPresent) {
                        existingAttendance.isPresent = true;
                        if (!existingAttendance.checkIn) {
                            existingAttendance.checkIn = roundedUTCDate;
                        }
                        existingAttendance.checkOut = null;
                    }
                    else {
                        if (existingAttendance.checkIn) {
                            const timeDifferenceMinutes = (roundedUTCDate.getTime() -
                                existingAttendance.checkIn.getTime()) /
                                1000 /
                                60;
                            console.log(timeDifferenceMinutes);
                            existingAttendance.workingHours = timeDifferenceMinutes;
                            existingAttendance.checkOut = roundedUTCDate;
                        }
                        existingAttendance.isPresent = false;
                    }
                    existingAttendance.currentRoundTime = roundedUTCDate;
                    yield existingAttendance.save();
                }
                else {
                    yield attendancerepository_1.default.create({
                        user: member._id,
                        date: now,
                        checkIn: isCurrentlyPresent ? roundedUTCDate : undefined,
                        currentRoundTime: roundedUTCDate,
                        college: member.college,
                        isPresent: isCurrentlyPresent,
                        workingHours: 0,
                        location: isCurrentlyPresent
                            ? {
                                type: "Point",
                                coordinates: member.location.coordinates,
                            }
                            : {
                                type: "Point",
                                coordinates: [0, 0],
                            },
                    });
                }
            }
            return presentMembers;
        });
    }
}
exports.default = new AdminService();
