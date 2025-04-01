import mongoose, { Document, Schema } from "mongoose";
import { thirtyDaysFromNow } from "../../utils/date/date";

export interface SessionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  expiredAt: Date;
  createdAt: Date;
}
