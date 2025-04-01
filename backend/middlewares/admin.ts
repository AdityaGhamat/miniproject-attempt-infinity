import { NextFunction, Request, Response } from "express";
import usercontroller from "../controllers/usercontroller";
import userservice from "../services/userservice";
import { UserEnumType } from "../types/enums/user-enum";
import { AppError } from "../utils/response/appError";
import { HttpStatusCode } from "../utils/response/statusCodes";
import { ApiResponse } from "../utils/response/apiResponse";

export const AdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user;
  const user = await userservice.get_profile(userId);
  if (user.role !== UserEnumType.ADMIN) {
    ApiResponse.error(res, "You are not admin", HttpStatusCode.UNAUTHORIZED);
  }
  next();
};
