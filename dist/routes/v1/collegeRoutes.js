"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const collegecontroller_1 = __importDefault(require("../../controllers/collegecontroller"));
const auth_1 = require("../../middlewares/auth");
const app = (0, express_1.Router)();
app.post("/", collegecontroller_1.default.create);
app.get("/:id", collegecontroller_1.default.getDetails);
app.get("/", auth_1.AuthMiddleware, collegecontroller_1.default.getAllColleges);
app.patch("/:id", collegecontroller_1.default.updateCollege);
app.delete("/:id", collegecontroller_1.default.deleteCollege);
app.get("/:id", collegecontroller_1.default.showCollegeStaff);
exports.default = app;
