import { Document, Types } from "mongoose";

export interface IAttendance extends Document {
  user: Types.ObjectId;
  college: Types.ObjectId;
  date: Date;
  checkIn: Date | undefined;
  checkOut: Date | null;
  isPresent: boolean;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  currentRoundTime: Date;
  workingHours: number;
}
