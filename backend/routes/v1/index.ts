import { Router } from "express";
import userRoutes from "./userRoutes";
import collegeRoutes from "./collegeRoutes";
import attendanceRoutes from "./attendanceRoutes";
const app = Router();
app.use("/user", userRoutes);
app.use("/college", collegeRoutes);
app.use("/attendance", attendanceRoutes);
export default app;
