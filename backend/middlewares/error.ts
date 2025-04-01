import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/response/appError";
import { ApiResponse } from "../utils/response/apiResponse";
import { logger } from "../config/logger";
import { HttpStatusCode } from "../utils/response/statusCodes";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): any => {
  console.error(`Error Occured on path ${req.path} : ${error}`);
  if (error instanceof SyntaxError) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "Invalid JSON format, please check your request body.",
    });
  }
  return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: error?.message || "Unknown error occured",
  });
};

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  errorHandler(err, req, res, _next);
};
