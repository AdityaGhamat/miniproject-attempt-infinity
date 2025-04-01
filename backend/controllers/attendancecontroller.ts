import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asynchandler";
import adminservice from "../services/adminservice";
import { ApiResponse } from "../utils/response/apiResponse";
import attendanceservice from "../services/attendanceservice";

class AttendanceController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const { college_id } = req.params;
    const response = await adminservice.findMembers(college_id);
    ApiResponse.success(res, response);
  });
  viewTodaysAttendance = asyncHandler(async (req: Request, res: Response) => {
    const { college_id } = req.params;
    const response = await attendanceservice.viewAttendanceOfToday(college_id);
    ApiResponse.success(res, response);
  });
  viewAttendance = asyncHandler(async (req: Request, res: Response) => {
    const { college_id } = req.params;
    const { fromDate, toDate, staffId, status, minHours, maxHours } = req.query;
    const response = await attendanceservice.viewAttendance(college_id, {
      fromDate,
      toDate,
      staffId,
      status,
      minHours,
      maxHours,
    });
    ApiResponse.success(res, response);
  });
}

export default new AttendanceController();
