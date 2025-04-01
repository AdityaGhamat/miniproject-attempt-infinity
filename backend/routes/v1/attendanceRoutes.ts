import { Router } from "express";
import attendancecontroller from "../../controllers/attendancecontroller";

const app = Router();

app.post("/:college_id", attendancecontroller.register);
app.get("/today/:college_id", attendancecontroller.viewTodaysAttendance);
app.get("/view/:college_id", attendancecontroller.viewAttendance);
export default app;
