"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
class DatabaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findOne({ filter, select, }) {
        return await this.model.findOne(filter).select(select || "");
    }
    async create({ data, options, }) {
        return await this.model.create(data, options);
    }
    async update({ filter, update, options, }) {
        return await this.model.updateOne(filter, { ...update, $inc: { __v: 1 } }, options);
    }
}
exports.DatabaseRepository = DatabaseRepository;
