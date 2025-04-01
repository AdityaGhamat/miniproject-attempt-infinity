import attendancerepository from "../repository/attendancerepository";
import userrepository from "../repository/userrepository";
import { AppError } from "../utils/response/appError";
import { HttpStatusCode } from "../utils/response/statusCodes";
import collegeservice from "./collegeservice";
import { startOfDay, endOfDay } from "date-fns";

class AdminService {
  async findMembers(college_id: any) {
    const college_coordinates = await collegeservice.getCollegeLocation(
      college_id
    );
    const radiusInMeters = 130;
    const radiusInRadians = radiusInMeters / 6371000;

    // Fetch all staff members
    const staffMembers = await userrepository.find({ college: college_id });

    // Fetch members inside the college radius
    const presentMembers = await userrepository.find({
      college: college_id,
      location: {
        $geoWithin: {
          $centerSphere: [college_coordinates, radiusInRadians],
        },
      },
    });

    const today = new Date();
    const currentRoundMinutes =
      Math.floor((today.getHours() * 60 + today.getMinutes()) / 15) * 15;
    const currentRoundTime = new Date(today.setMinutes(currentRoundMinutes));

    for (const member of staffMembers) {
      const existingAttendance = await attendancerepository.findOne({
        user: member._id,
        date: { $gte: startOfDay(today), $lte: endOfDay(today) },
      });

      const isCurrentlyPresent = presentMembers.some((present: any) =>
        present._id.equals(member._id)
      );

      if (existingAttendance) {
        if (isCurrentlyPresent) {
          // If user is now present, mark as present
          existingAttendance.isPresent = true;
          if (!existingAttendance.checkIn) {
            existingAttendance.checkIn = new Date();
          }
          // Reset checkout time if user returns
          existingAttendance.checkOut = null;
        } else {
          // If user was previously present but is now absent
          if (existingAttendance.isPresent) {
            const timeDifference =
              (currentRoundTime.getTime() -
                existingAttendance.currentRoundTime.getTime()) /
              1000 /
              60;

            existingAttendance.workingHours =
              (existingAttendance.workingHours?.valueOf() || 0) +
              timeDifference;

            // Set checkout time
            existingAttendance.checkOut = currentRoundTime;
          }
          existingAttendance.isPresent = false;
        }
        existingAttendance.currentRoundTime = currentRoundTime;
        await existingAttendance.save();
      } else {
        // If no previous record, create a new one
        await attendancerepository.create({
          user: member._id as any,
          date: today,
          checkIn: isCurrentlyPresent ? new Date() : undefined, // Ensure checkOut is null at the start
          currentRoundTime: currentRoundTime,
          college: member.college as any,
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
  }
}

export default new AdminService();
