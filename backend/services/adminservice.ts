import attendancerepository from "../repository/attendancerepository";
import userrepository from "../repository/userrepository";
import collegeservice from "./collegeservice";
import { startOfDay, endOfDay } from "date-fns";

class AdminService {
  async findMembers(college_id: any) {
    const college_coordinates = await collegeservice.getCollegeLocation(
      college_id
    );
    const radiusInMeters = 130;
    const radiusInRadians = radiusInMeters / 6371000;

    const staffMembers = await userrepository.find({ college: college_id });

    const presentMembers = await userrepository.find({
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
      const existingAttendance = await attendancerepository.findOne({
        user: member._id,
        date: { $gte: startOfDay(now), $lte: endOfDay(now) },
      });

      const isCurrentlyPresent = presentMembers.some((present: any) =>
        present._id.equals(member._id)
      );

      if (existingAttendance) {
        if (isCurrentlyPresent) {
          existingAttendance.isPresent = true;
          if (!existingAttendance.checkIn) {
            existingAttendance.checkIn = roundedUTCDate;
          }
          existingAttendance.checkOut = null;
        } else {
          if (existingAttendance.checkIn) {
            const timeDifferenceMinutes =
              (roundedUTCDate.getTime() -
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

        await existingAttendance.save();
      } else {
        await attendancerepository.create({
          user: member._id as any,
          date: now,
          checkIn: isCurrentlyPresent ? roundedUTCDate : undefined,
          currentRoundTime: roundedUTCDate,
          college: member.college as any,
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
  }
}

export default new AdminService();
