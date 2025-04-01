import { Schema, model } from "mongoose";
import type { IAttendance } from "../types/database/attendance";

const attendanceSchema = new Schema<IAttendance>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    college: {
      type: Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    isPresent: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    currentRoundTime: {
      type: Date,
    },
    workingHours: {
      type: Date,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = model<IAttendance>("Attendance", attendanceSchema);
export default Attendance;
