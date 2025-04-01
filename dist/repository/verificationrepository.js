"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crudrepository_1 = require("./crudrepository");
const verification_1 = __importDefault(require("../models/verification"));
class VerificationRepository extends crudrepository_1.CrudRepository {
    constructor() {
        super(verification_1.default);
    }
}
exports.default = new VerificationRepository();
