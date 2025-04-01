"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const passlib_1 = __importDefault(require("../lib/services/passlib"));
const user_enum_1 = require("../types/enums/user-enum");
const userPreference = new mongoose_1.Schema({
    enable2FA: {
        type: Boolean,
        default: false,
    },
    enableNotification: {
        type: Boolean,
        default: false,
    },
    twoFactorString: {
        type: String,
    },
});
const userSchema = new mongoose_1.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    userPreference: { type: userPreference, default: {} },
    college: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "College",
        default: null,
        required: false,
    },
    role: {
        type: String,
        enum: Object.values(user_enum_1.UserEnumType),
        default: user_enum_1.UserEnumType.STAFF,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            required: false,
            // validate: {
            //   validator: (val: number[]) => val.length === 2,
            //   message:
            //     "Coordinates must have exactly two values (latitude and longitude).",
            // },
        },
    },
    sessionToken: { type: String },
    refreshToken: { type: String },
}, {
    timestamps: true,
    toJSON: {},
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            this.password = yield passlib_1.default.encryptPassword(this.password);
        }
        next();
    });
});
userSchema.methods.comparePassword = function (value) {
    return __awaiter(this, void 0, void 0, function* () {
        return passlib_1.default.verifyPassword(value, this.password);
    });
};
userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.userPreference.twoFactorString;
        return ret;
    },
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
