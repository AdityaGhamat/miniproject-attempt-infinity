import { Document } from "mongoose";

export interface ICollege extends Document {
  name: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
}
