"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.RoleEnum = exports.GenderEnum = void 0;
const mongoose_1 = require("mongoose");
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["male"] = "male";
    GenderEnum["female"] = "female";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["admin"] = "admin";
    RoleEnum["user"] = "user";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true, minLength: 2, maxLength: 20 },
    lastName: { type: String, required: true, minLength: 2, maxLength: 20 },
    email: { type: String, required: true, unique: true },
    confirmEmailOtp: { type: String },
    confirmedAt: { type: Date },
    password: { type: String, required: true },
    resetPasswordOtp: { type: String },
    changeCredentialsTime: { type: Date },
    gender: { type: String, enum: GenderEnum, default: GenderEnum.female },
    role: { type: String, enum: RoleEnum, default: RoleEnum.user },
    phone: { type: String },
    address: { type: String },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
userSchema
    .virtual("username")
    .set(function (value) {
    const [firstName, lastName] = value.split(" ") || [];
    this.set({ firstName, lastName });
})
    .get(function () {
    return this.firstName + " " + this.lastName;
});
exports.UserModel = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
