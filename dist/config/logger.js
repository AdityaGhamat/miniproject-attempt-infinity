"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const serverconfig_1 = __importDefault(require("./serverconfig"));
const logLevel = serverconfig_1.default.NODE_ENV === "production" ? "info" : "debug";
const formatConfig = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.metadata());
const transports = [
    new winston_1.default.transports.Console({
        level: logLevel,
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
    }),
];
if (serverconfig_1.default.NODE_ENV === "production") {
    transports.push(new winston_daily_rotate_file_1.default({
        filename: "logs/error-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        level: "error",
        maxSize: "20m",
        maxFiles: "14d",
    }), new winston_daily_rotate_file_1.default({
        filename: "logs/combined-%DATE%.log",
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
        maxFiles: "14d",
    }));
}
exports.logger = winston_1.default.createLogger({
    level: serverconfig_1.default.NODE_ENV === "production" ? "info" : "debug",
    format: formatConfig,
    transports,
});
exports.requestLogger = winston_1.default.createLogger({
    format: formatConfig,
    transports: [
        new winston_daily_rotate_file_1.default({
            filename: "logs/requests-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d",
        }),
    ],
});
