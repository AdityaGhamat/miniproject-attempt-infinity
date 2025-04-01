import attendancerepository from "../repository/attendancerepository";
import adminservice from "./adminservice";
import { startOfDay, endOfDay } from "date-fns";

class AttendanceService {
  async viewAttendanceOfToday(collegeId: any) {
    const today = new Date();
    const attendanceLogs = await attendancerepository.find(
      {
        college: collegeId,
        date: { $gte: startOfDay(today), $lte: endOfDay(today) },
      },
      {
        populate: ["user", "college"],
      }
    );

    return attendanceLogs;
  }
  async viewAttendance(collegeId: string, filters: any) {
    const { fromDate, toDate, staffId, status, minHours, maxHours } = filters;

    const query: any = { college: collegeId };

    if (fromDate && toDate) {
      query.date = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    }

    if (staffId) {
      query.user = staffId;
    }

    if (status === "present") {
      query.isPresent = true;
    } else if (status === "absent") {
      query.isPresent = false;
    }

    if (minHours || maxHours) {
      query.workingHours = {};
      if (minHours) query.workingHours.$gte = minHours;
      if (maxHours) query.workingHours.$lte = maxHours;
    }

    return attendancerepository.find(query, { populate: ["user", "college"] });
  }
}

export default new AttendanceService();
