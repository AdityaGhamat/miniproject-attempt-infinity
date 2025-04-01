import collegeservice from "../services/collegeservice";
import { asyncHandler } from "../middlewares/asynchandler";
import { Request, Response } from "express";
import { ApiResponse } from "../utils/response/apiResponse";

class CollegeController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const { user_id } = req.query;
    if (!user_id) {
      ApiResponse.error(res, "user_id needs to pass in query to request");
    }
    const response = await collegeservice.create(body, user_id);
    ApiResponse.success(res, response);
  });

  getAllColleges = asyncHandler(async (req: Request, res: Response) => {
    const colleges = await collegeservice.getAllColleges();
    ApiResponse.success(res, colleges);
  });

  getDetails = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await collegeservice.getDetails(id);
    ApiResponse.success(res, response);
  });

  updateCollege = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const college = req.body;
    const response = await collegeservice.updateCollege(id, college);
    ApiResponse.success(res, response);
  });

  deleteCollege = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await collegeservice.deleteCollege(id);
    ApiResponse.success(res, response);
  });

  showCollegeStaff = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await collegeservice.showStaff(id);
    ApiResponse.success(res, response);
  });
}

export default new CollegeController();
