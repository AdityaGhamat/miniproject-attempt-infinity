"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attendance_1 = __importDefault(require("../models/attendance"));
const crudrepository_1 = require("./crudrepository");
class AttendanceRepository extends crudrepository_1.CrudRepository {
    constructor() {
        super(attendance_1.default);
    }
}
exports.default = new AttendanceRepository();
