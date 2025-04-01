"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const date_1 = require("../utils/date/date");
const sessionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: date_1.thirtyDaysFromNow,
    },
});
const Session = (0, mongoose_1.model)("Session", sessionSchema);
exports.default = Session;
