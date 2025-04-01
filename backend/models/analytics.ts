import { IAnalytics } from "../types/database/analytics";
import { Schema, model } from "mongoose";

const analyticsSchema = new Schema<IAnalytics>({
  college: {
    type: Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  presentDays: {
    type: Number,
  },
  absentDays: {
    type: Number,
  },
  lateCheckIns: {
    type: Number,
  },
  earlyCheckOuts: {
    type: Number,
  },
  averageCheckInTime: {
    type: Number,
  },
  averageCheckOutTime: {
    type: Number,
  },
});

const Analytics = model<IAnalytics>("Analytics", analyticsSchema);

export default Analytics;
