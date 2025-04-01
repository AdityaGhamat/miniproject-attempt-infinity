"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crudrepository_1 = require("./crudrepository");
const college_1 = __importDefault(require("../models/college"));
class CollegeRepository extends crudrepository_1.CrudRepository {
    constructor() {
        super(college_1.default);
    }
}
exports.default = new CollegeRepository();
