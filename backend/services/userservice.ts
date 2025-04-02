import userrepository from "../repository/userrepository";
import type { User as IUser } from "../types/database/user";
import { AppError } from "../utils/response/appError";
import { ErrorCode } from "../utils/response/errorCodes";
import { HttpStatusCode } from "../utils/response/statusCodes";
import verificationrepository from "../repository/verificationrepository";
import { VerificationEnum } from "../types/enums/verification-enum";
import { fourtyFiveMinutesFromNow } from "../utils/date/date";
import { Types } from "mongoose";
import collegeservice from "./collegeservice";

class UserServices {
  async signup(data: Partial<IUser>) {
    const { email } = data;
    try {
      const emailCheck = await userrepository.isEmailExists(email!);
      if (emailCheck) {
        throw new AppError(
          "Email already exists",
          HttpStatusCode.CONFLICT,
          ErrorCode.ALREADY_EXISTS
        );
      }
      const response = await userrepository.create(data);
      const userId = response?._id as Types.ObjectId;
      const verificationCode = await verificationrepository.create({
        userId,
        type: VerificationEnum.EMAIL_VERIFICATION,
        expiresAt: fourtyFiveMinutesFromNow(),
      });

      if (!response) {
        throw new AppError("Failed to create user", HttpStatusCode.BAD_REQUEST);
      }
      return response;
    } catch (error: any) {
      throw new AppError(
        error.message,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.SERVICE_UNAVAILABLE,
        false,
        error
      );
    }
  }
  async signin(data: Partial<IUser>) {
    const { email, password } = data;
    try {
      const response = await userrepository.findOne(
        email!,
        undefined,
        "college"
      );
      if (!response) {
        throw new AppError(
          "User not found",
          HttpStatusCode.NOT_FOUND,
          ErrorCode.NOT_FOUND,
          true
        );
      }
      const passwordCheck = await response.comparePassword(password!);
      if (!passwordCheck) {
        throw new AppError(
          "Password is incorrect",
          HttpStatusCode.BAD_REQUEST,
          ErrorCode.INVALID_PASSWORD
        );
      }
      const userId = response._id as Types.ObjectId;
      // const session = await sessionrepository.create({
      //   userId,
      //   userAgent,
      // });
      return { _id: response._id, user: response };
    } catch (error: any) {
      throw new AppError(
        error.message,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        ErrorCode.SERVICE_UNAVAILABLE,
        false,
        error
      );
    }
  }
  async update_location(user: Types.ObjectId, data: IUser["location"]) {
    const updated_user = await userrepository.findById(user);
    if (!updated_user) {
      throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
    }
    updated_user.location = { type: "Point", coordinates: data.coordinates };

    await updated_user.save();

    return updated_user;
  }
  async get_location(user: Types.ObjectId) {
    const the_user = await userrepository.findById(user);
    if (!the_user) {
      throw new AppError("user not found", HttpStatusCode.NOT_FOUND);
    }
    const location = the_user?.location?.coordinates;
    return location;
  }

  async get_profile(user_id: any) {
    const user = await userrepository.findById(
      user_id,
      undefined,
      undefined,
      "college"
    );
    if (!user) {
      throw new AppError("User not found", HttpStatusCode.NOT_FOUND);
    }
    return user;
  }

  async join_college(userId: any, collegeId: any) {
    const user = await this.get_profile(userId);
    const college = await collegeservice.getDetails(collegeId);
    if (!college) {
      throw new AppError("College not found", HttpStatusCode.NOT_FOUND);
    }
    if (user.college) {
      throw new AppError(
        "User is already in college",
        HttpStatusCode.BAD_REQUEST
      );
    }
    user.college = collegeId;
    await user.save();
    return user;
  }

  async exit_college(userId: any) {
    const user = await this.get_profile(userId);
    if (!user.college) {
      throw new AppError("Not in college", HttpStatusCode.BAD_REQUEST);
    }
    user.college = null;

    await user.save();

    return true;
  }
}

export default new UserServices();
