import mongoose, { Document } from "mongoose";
import { VerificationEnum } from "../enums/verification-enum";

export interface VerficationCodeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  type: VerificationEnum;
  expiresAt: Date;
  createdAt: Date;
}
