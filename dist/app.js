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
const express_1 = __importDefault(require("express"));
const serverconfig_1 = __importDefault(require("./config/serverconfig"));
const database_1 = require("./config/database");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_1 = __importDefault(require("./routes/index"));
const error_1 = require("./middlewares/error");
const path_1 = __importDefault(require("path"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.middleware();
        this.routes();
        this.error();
    }
    middleware() {
        this.app.use((0, cors_1.default)());
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.static(path_1.default.resolve(__dirname, "../frontend/dist")));
    }
    routes() {
        this.app.use("/api", index_1.default);
    }
    error() {
        this.app.use(error_1.errorMiddleware);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, database_1.connectToDatabase)();
            this.app.listen(serverconfig_1.default.PORT, () => {
                console.log(`server started , http://localhost:${serverconfig_1.default.PORT}`);
            });
        });
    }
}
exports.default = new Server();
