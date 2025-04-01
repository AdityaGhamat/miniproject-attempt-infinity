"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_1 = __importDefault(require("../models/session"));
const crudrepository_1 = require("./crudrepository");
class SessionRepository extends crudrepository_1.CrudRepository {
    constructor() {
        super(session_1.default);
    }
}
exports.default = new SessionRepository();
