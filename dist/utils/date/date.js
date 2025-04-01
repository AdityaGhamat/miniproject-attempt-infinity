"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fourtyFiveMinutesFromNow = exports.thirtyDaysFromNow = void 0;
const thirtyDaysFromNow = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
exports.thirtyDaysFromNow = thirtyDaysFromNow;
const fourtyFiveMinutesFromNow = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 45);
    return now;
};
exports.fourtyFiveMinutesFromNow = fourtyFiveMinutesFromNow;
