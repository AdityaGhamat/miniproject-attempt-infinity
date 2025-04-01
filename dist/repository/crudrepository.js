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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudRepository = void 0;
class CrudRepository {
    constructor(model) {
        this.model = model;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.create(data);
        });
    }
    find(args, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = this.model.find(args, null, options).lean();
            if (options === null || options === void 0 ? void 0 : options.populate) {
                query = query.populate(options.populate);
            }
            return query.exec();
        });
    }
    findOne(args, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = typeof args === "string" ? { email: args } : args;
            return this.model.findOne(query, null, options).exec();
        });
    }
    findById(id, fields, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findById(id, fields === null || fields === void 0 ? void 0 : fields.join(" "), options).exec();
        });
    }
    findByIdAndUpdate(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .findByIdAndUpdate(id, data, Object.assign({ new: true }, options))
                .exec();
        });
    }
    findByIdAndDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.findByIdAndDelete(id).exec();
            return !!result;
        });
    }
    updateMany(args, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.updateMany(args, data, options).exec();
            return result.modifiedCount;
        });
    }
    deleteMany(args, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.model.deleteMany(args, options).exec();
            return result.deletedCount;
        });
    }
    count(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments(args).exec();
        });
    }
    exists(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.exists(args).exec() !== null;
        });
    }
    aggregate(pipeline) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.aggregate(pipeline).exec();
        });
    }
    paginate(args, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = options || {};
            const skip = (page - 1) * limit;
            const [data, total] = yield Promise.all([
                this.model.find(args).skip(skip).limit(limit).exec(),
                this.model.countDocuments(args).exec(),
            ]);
            return { data, total, page, limit };
        });
    }
}
exports.CrudRepository = CrudRepository;
