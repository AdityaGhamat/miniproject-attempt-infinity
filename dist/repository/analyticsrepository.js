"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_1 = __importDefault(require("../models/analytics"));
const crudrepository_1 = require("./crudrepository");
class AnalyticsRepository extends crudrepository_1.CrudRepository {
    constructor() {
        super(analytics_1.default);
    }
}
exports.default = new AnalyticsRepository();
