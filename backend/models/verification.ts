import { Schema, model } from "mongoose";
import { VerficationCodeDocument } from "../types/database/verification";
import { generateUniqueCode } from "../utils/randomGeneration";

const verificationSchema = new Schema<VerficationCodeDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
    default: generateUniqueCode,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});
const Verification = model<VerficationCodeDocument>(
  "Verification",
  verificationSchema,
  "verification-code"
);
export default Verification;
