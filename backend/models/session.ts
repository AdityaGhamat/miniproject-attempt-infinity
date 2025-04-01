import { Schema, model } from "mongoose";
import type { SessionDocument } from "../types/database/session";
import { thirtyDaysFromNow } from "../utils/date/date";

const sessionSchema = new Schema<SessionDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: thirtyDaysFromNow,
  },
});

const Session = model<SessionDocument>("Session", sessionSchema);
export default Session;
