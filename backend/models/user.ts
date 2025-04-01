import { Schema, Types, model } from "mongoose";
import type { User, UserPreferences } from "../types/database/user";
import { hash } from "bcryptjs";
import passlib from "../lib/services/passlib";
import type { IAttendance } from "../types/database/attendance";
import { UserEnumType } from "../types/enums/user-enum";
const userPreference = new Schema<UserPreferences>({
  enable2FA: {
    type: Boolean,
    default: false,
  },
  enableNotification: {
    type: Boolean,
    default: false,
  },
  twoFactorString: {
    type: String,
  },
});

const userSchema = new Schema<User>(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    userPreference: { type: userPreference, default: {} },
    college: {
      type: Schema.Types.ObjectId,
      ref: "College",
      default: null,
      required: false,
    },
    role: {
      type: String,
      enum: Object.values(UserEnumType),
      default: UserEnumType.STAFF,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: false,
        // validate: {
        //   validator: (val: number[]) => val.length === 2,
        //   message:
        //     "Coordinates must have exactly two values (latitude and longitude).",
        // },
      },
    },
    sessionToken: { type: String },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
    toJSON: {},
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await passlib.encryptPassword(this.password);
  }
  next();
});

userSchema.methods.comparePassword = async function (value: string) {
  return passlib.verifyPassword(value, this.password);
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.userPreference.twoFactorString;
    return ret;
  },
});
const User = model<User>("User", userSchema);
export default User;
