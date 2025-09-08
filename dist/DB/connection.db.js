"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User_Model_js_1 = require("./models/User.Model.js");
const connectDB = async () => {
    try {
        const result = await (0, mongoose_1.connect)(process.env.DB_URI);
        await User_Model_js_1.UserModel.syncIndexes();
        console.log(result.models);
        console.log("DB connected successfully 😁");
    }
    catch (error) {
        console.log("fail to connected 😑");
    }
};
exports.default = connectDB;
