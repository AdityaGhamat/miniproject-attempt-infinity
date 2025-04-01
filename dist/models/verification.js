"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const randomGeneration_1 = require("../utils/randomGeneration");
const verificationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true,
    },
    code: {
        type: String,
        unique: true,
        required: true,
        default: randomGeneration_1.generateUniqueCode,
    },
    type: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});
const Verification = (0, mongoose_1.model)("Verification", verificationSchema, "verification-code");
exports.default = Verification;
