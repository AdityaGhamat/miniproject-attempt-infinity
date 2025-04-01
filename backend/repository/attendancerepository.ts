import { IAttendance } from "../types/database/attendance";
import Attendance from "../models/attendance";
import { CrudRepository } from "./crudrepository";

class AttendanceRepository extends CrudRepository<IAttendance, any> {
  constructor() {
    super(Attendance);
  }
}

export default new AttendanceRepository();
