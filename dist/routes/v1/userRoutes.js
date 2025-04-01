"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usercontroller_1 = __importDefault(require("../../controllers/usercontroller"));
const auth_1 = require("../../middlewares/auth");
const app = (0, express_1.Router)();
app.post("/signup", usercontroller_1.default.signup);
app.post("/signin", usercontroller_1.default.signIn);
app.put("/location/:userId", auth_1.AuthMiddleware, usercontroller_1.default.updateLocation);
app.get("/location", auth_1.AuthMiddleware, usercontroller_1.default.getLocation);
app.get("/:id", auth_1.AuthMiddleware, usercontroller_1.default.getProfile);
app.put("/join/:collegeId", auth_1.AuthMiddleware, usercontroller_1.default.joinCollege);
app.put("/exit-college", auth_1.AuthMiddleware, usercontroller_1.default.exitCollege);
exports.default = app;
