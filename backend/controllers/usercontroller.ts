import type { Request, Response, NextFunction } from "express";
import userservice from "../services/userservice";
import session from "../lib/services/session";
import { ApiResponse } from "../utils/response/apiResponse";
import { asyncHandler } from "../middlewares/asynchandler";
import { Types } from "mongoose";

class UserController {
  signup = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const response = await userservice.signup(data);
    const new_session = await session.createSession(
      response._id as string,
      res
    );
    ApiResponse.success(
      res,
      { token: new_session, user: response },
      "User signup successful."
    );
  });

  signIn = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const response = await userservice.signin(data);
    const user = response.user;
    const new_session = await session.createSession(
      response._id as string,
      res
    );
    ApiResponse.success(res, { new_session, user }, "User signin successful.");
  });

  updateLocation = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const data = req.body;
    const response = await userservice.update_location(userId as any, data);
    ApiResponse.success(res, response, "updated location");
  });

  getLocation = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user.userId;
    const response = await userservice.get_location(user as any);
    ApiResponse.success(res, response, "location has been fetched");
  });

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userservice.get_profile(id);
    ApiResponse.success(res, user, "profile has been found");
  });

  joinCollege = asyncHandler(async (req: Request, res: Response) => {
    const { collegeId } = req.params;
    const userId = req.user.userId;
    const response = await userservice.join_college(userId, collegeId);
    ApiResponse.success(res, response, "college has been joined");
  });

  exitCollege = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const response = await userservice.exit_college(userId);
    ApiResponse.success(res, response, "Exited the college");
  });
}

export default new UserController();
