import { Http } from "winston/lib/winston/transports";
import collegerepository from "../repository/collegerepository";
import userrepository from "../repository/userrepository";
import type { ICollege } from "../types/database/college";
import { AppError } from "../utils/response/appError";
import { HttpStatusCode } from "../utils/response/statusCodes";
import userservice from "./userservice";

class CollegeService {
  async create(data: Partial<ICollege>, user_id: any) {
    const response = await collegerepository.create(data);
    if (!response) {
      throw new AppError(
        "Failed to create college",
        HttpStatusCode.BAD_REQUEST
      );
    }
    const updatedUser = await userrepository.findByIdAndUpdate(user_id, {
      college: response._id as any,
    });
    if (!updatedUser) {
      throw new AppError(
        "Failed to update College in user",
        HttpStatusCode.BAD_REQUEST
      );
    }
    return response;
  }
  async getAllColleges() {
    const response = await collegerepository.find({});
    if (!response || response.length == 0) {
      throw new AppError("Colleges not found", HttpStatusCode.NOT_FOUND);
    }
    return response;
  }
  async getDetails(id: any) {
    const response = await collegerepository.findById(id);
    if (!response) {
      throw new AppError("Failed to find college", HttpStatusCode.BAD_REQUEST);
    }
    return response;
  }
  async updateCollege(id: any, data: Partial<ICollege>) {
    const college = await collegerepository.findById(id);
    if (!college) {
      throw new AppError("Failed to find college", HttpStatusCode.BAD_REQUEST);
    }
    const response = await collegerepository.findByIdAndUpdate(id, data);
    if (!response) {
      throw new AppError(
        "Failed to update college.",
        HttpStatusCode.BAD_REQUEST
      );
    }
    return response;
  }

  async deleteCollege(id: any) {
    const college = await collegerepository.findById(id);
    if (!college) {
      throw new AppError("Failed to find college", HttpStatusCode.BAD_REQUEST);
    }
    const response = await collegerepository.findByIdAndDelete(id);
    if (!response) {
      throw new AppError(
        "Failed to delete college.",
        HttpStatusCode.BAD_REQUEST
      );
    }
    return response;
  }

  async getCollegeLocation(collegeId: any) {
    const college = await collegerepository.findById(collegeId);
    if (!college) {
      throw new AppError("Failed to find college", HttpStatusCode.BAD_REQUEST);
    }
    const college_location = college?.location;
    const coordinates = college_location.coordinates;
    return coordinates;
  }

  async showStaff(collegeId: any) {
    const members = await userrepository.find(
      { college: collegeId },
      { populate: "college" }
    );

    if (!members || members.length === 0) {
      throw new AppError("Members not found", HttpStatusCode.NOT_FOUND);
    }
    return members;
  }
}

export default new CollegeService();
