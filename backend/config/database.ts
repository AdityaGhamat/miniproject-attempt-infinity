import mongoose from "mongoose";
import serverconfig from "./serverconfig";

export async function connectToDatabase(): Promise<void> {
  try {
    mongoose
      .connect(
        (serverconfig.DATABASE_URL as string) ||
          "mongodb+srv://adityaghamat01:adityaghamat@geolocation.mgxzh0a.mongodb.net/owl"
      )
      .then(() => console.log(`database connected`))
      .catch((err) => console.error(err));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
