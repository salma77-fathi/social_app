"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandling = exports.ApplicationException = void 0;
class ApplicationException extends Error {
    statusCode;
    constructor(message, statusCode, options) {
        super(message, options);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApplicationException = ApplicationException;
const globalErrorHandling = (error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        err_message: error.message || "something went wrong!",
        stack: process.env.MOOD === "development" ? error.stack : undefined,
        error,
    });
};
exports.globalErrorHandling = globalErrorHandling;
