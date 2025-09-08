"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = exports.validation = void 0;
const zod_1 = require("zod");
const error_response_js_1 = require("../utils/response/error.response.js");
const validation = (schema) => {
    return (req, res, next) => {
        console.log(schema);
        console.log(Object.keys(schema));
        const validationErrors = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const validationResult = schema[key].safeParse(req[key]);
            if (!validationResult.success) {
                const errors = validationResult.error;
                validationErrors.push({
                    key,
                    issues: errors.issues.map((issue) => {
                        return {
                            message: issue.message,
                            path: issue.path[0],
                        };
                    }),
                });
            }
        }
        if (validationErrors.length) {
            throw new error_response_js_1.BadRequestException("validation error", {
                errors: validationErrors,
            });
        }
        return next();
    };
};
exports.validation = validation;
exports.generalFields = {
    username: zod_1.z
        .string({ error: "User name is required" })
        .min(2, { error: "min length is 2 char" })
        .max(20, { error: "max length is 20 char" }),
    email: zod_1.z.email({ error: "make sure the email is correct" }),
    otp: zod_1.z.string().regex(/^\d{6}$/),
    password: zod_1.z
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/),
    confirmPassword: zod_1.z.string(),
};
