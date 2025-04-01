import { Router } from "express";
import collegecontroller from "../../controllers/collegecontroller";
import { AuthMiddleware } from "../../middlewares/auth";
const app = Router();

app.post("/", collegecontroller.create);
app.get("/:id", collegecontroller.getDetails);
app.get("/", AuthMiddleware, collegecontroller.getAllColleges);
app.patch("/:id", collegecontroller.updateCollege);
app.delete("/:id", collegecontroller.deleteCollege);
app.get("/staff/:id", collegecontroller.showCollegeStaff);
export default app;
