"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const analyticsSchema = new mongoose_1.Schema({
    college: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "College",
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    presentDays: {
        type: Number,
    },
    absentDays: {
        type: Number,
    },
    lateCheckIns: {
        type: Number,
    },
    earlyCheckOuts: {
        type: Number,
    },
    averageCheckInTime: {
        type: Number,
    },
    averageCheckOutTime: {
        type: Number,
    },
});
const Analytics = (0, mongoose_1.model)("Analytics", analyticsSchema);
exports.default = Analytics;
