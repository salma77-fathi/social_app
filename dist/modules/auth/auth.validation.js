"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmEmail = exports.signup = exports.login = void 0;
const zod_1 = require("zod");
const validation_middleware_js_1 = require("../../middleware/validation.middleware.js");
exports.login = {
    body: zod_1.z.strictObject({
        email: validation_middleware_js_1.generalFields.email,
        password: validation_middleware_js_1.generalFields.password,
    }),
};
exports.signup = {
    body: exports.login.body
        .extend({
        username: validation_middleware_js_1.generalFields.username,
        confirmPassword: validation_middleware_js_1.generalFields.confirmPassword,
    })
        .superRefine((data, ctx) => {
        if (data.confirmPassword !== data.password) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "password mismatch confirmPassword",
            });
        }
    }),
};
exports.confirmEmail = {
    body: zod_1.z.strictObject({
        email: validation_middleware_js_1.generalFields.email,
        otp: validation_middleware_js_1.generalFields.otp,
    })
};
