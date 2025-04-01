"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendancecontroller_1 = __importDefault(require("../../controllers/attendancecontroller"));
const app = (0, express_1.Router)();
app.post("/:college_id", attendancecontroller_1.default.register);
app.get("/today/:college_id", attendancecontroller_1.default.viewTodaysAttendance);
app.get("/view/:college_id", attendancecontroller_1.default.viewAttendance);
exports.default = app;
