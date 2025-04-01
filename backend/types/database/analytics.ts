import { Document, Types } from "mongoose";

export interface IAnalytics extends Document {
  college: Types.ObjectId;
  user: Types.ObjectId;
  month: number;
  year: number;
  presentDays: number;
  absentDays: number;
  lateCheckIns: number;
  earlyCheckOuts: number;
  averageCheckInTime?: string;
  averageCheckOutTime?: string;
}
