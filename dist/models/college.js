"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const collegeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point",
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: (val) => val.length === 2,
                message: "Coordinates must have exactly two values (latitude and longitude).",
            },
        },
    },
}, {
    timestamps: true,
});
collegeSchema.index({ location: "2dsphere" });
const College = (0, mongoose_1.model)("College", collegeSchema);
exports.default = College;
