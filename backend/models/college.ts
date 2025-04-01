import { Schema, model } from "mongoose";
import { ICollege } from "../types/database/college";

const collegeSchema = new Schema<ICollege>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (val: number[]) => val.length === 2,
          message:
            "Coordinates must have exactly two values (latitude and longitude).",
        },
      },
    },
  },
  {
    timestamps: true,
  }
);
collegeSchema.index({ location: "2dsphere" });

const College = model<ICollege>("College", collegeSchema);

export default College;
