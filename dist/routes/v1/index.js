"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const collegeRoutes_1 = __importDefault(require("./collegeRoutes"));
const attendanceRoutes_1 = __importDefault(require("./attendanceRoutes"));
const app = (0, express_1.Router)();
app.use("/user", userRoutes_1.default);
app.use("/college", collegeRoutes_1.default);
app.use("/attendance", attendanceRoutes_1.default);
exports.default = app;
