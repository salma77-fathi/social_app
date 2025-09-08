"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = require("node:path");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: (0, node_path_1.resolve)("./config/.env.development") });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = require("express-rate-limit");
const auth_controller_js_1 = __importDefault(require("./modules/auth/auth.controller.js"));
const error_response_js_1 = require("./utils/response/error.response.js");
const connection_db_js_1 = __importDefault(require("./DB/connection.db.js"));
const bootstrap = async () => {
    const app = (0, express_1.default)();
    const port = process.env.PORT || 5000;
    const limiter = (0, express_rate_limit_1.rateLimit)({
        windowMs: 60 * 60000,
        limit: 20000,
        message: { error: "Too many requests , try again later" },
    });
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, helmet_1.default)());
    app.use(limiter);
    app.get("/", (req, res) => {
        res.json({
            message: `Welcome to ${process.env.APPLICATION_NAME} backend landing page 💖`,
        });
    });
    app.use("/auth", auth_controller_js_1.default);
    app.use("{/*dummy}", (req, res) => {
        return res.status(404).json({ message: "In-valid Routing try again ❌" });
    });
    app.use(error_response_js_1.globalErrorHandling);
    await (0, connection_db_js_1.default)();
    app.listen(port, () => {
        console.log(`Server is Running on ${port} 🚀`);
    });
};
exports.default = bootstrap;
