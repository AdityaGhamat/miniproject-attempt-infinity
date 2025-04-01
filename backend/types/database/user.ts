import { Document, Types } from "mongoose";
import { UserEnumType } from "../enums/user-enum";

export interface UserPreferences {
  enable2FA: boolean;
  enableNotification: boolean;
  twoFactorString?: string;
}

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  college: Types.ObjectId | null;
  role: UserEnumType;
  sessionToken?: string;
  refreshToken?: string;
  userPreference: UserPreferences;
  userAgent?: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  comparePassword(value: string): Promise<boolean>;
}
