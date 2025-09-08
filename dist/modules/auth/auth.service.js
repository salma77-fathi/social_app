"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_js_1 = require("../../DB/models/User.model.js");
const user_repository_js_1 = require("../../DB/repository/user.repository.js");
const error_response_js_1 = require("../../utils/response/error.response.js");
const hash_security_js_1 = require("../../utils/security/hash.security.js");
const email_event_js_1 = require("../../utils/event/email.event.js");
const otp_js_1 = require("../../utils/otp.js");
const token_security_js_1 = require("../../utils/security/token.security.js");
class AuthenticationService {
    userModel = new user_repository_js_1.UserRepository(User_model_js_1.UserModel);
    constructor() { }
    signup = async (req, res) => {
        let { username, email, password } = req.body;
        console.log({ username, email, password });
        const checkUserExits = await this.userModel.findOne({
            filter: { email },
        });
        if (checkUserExits) {
            throw new error_response_js_1.ConflictException("this user is already exits");
        }
        const otp = (0, otp_js_1.generateNumberOtp)();
        const user = await this.userModel.createUser({
            data: [
                {
                    username,
                    email,
                    password: await (0, hash_security_js_1.generateHash)(password),
                    confirmEmailOtp: await (0, hash_security_js_1.generateHash)(String(otp)),
                },
            ],
        });
        email_event_js_1.emailEvent.emit("Confirm-Email", { to: email, otp });
        return res.status(201).json({ message: "Done", data: { user } });
    };
    confirmEmail = async (req, res) => {
        const { email, otp } = req.body;
        const user = await this.userModel.findOne({
            filter: {
                email,
                confirmEmail: { $exists: true },
                confirmedAt: { $exists: false },
            },
        });
        if (!user) {
            throw new error_response_js_1.NotFoundException("Invalid account");
        }
        if (!(await (0, hash_security_js_1.compareHash)(otp, user.confirmEmailOtp))) {
            throw new error_response_js_1.ConflictException("invalid code");
        }
        await this.userModel.update({
            filter: {
                email,
            },
            update: { confirmedAt: new Date(), $unset: { confirmEmailOtp: 1 } },
        });
        return res.json({ message: "Done" });
    };
    login = async (req, res) => {
        const { email, password } = req.body;
        const user = await this.userModel.findOne({
            filter: { email },
        });
        if (!user) {
            throw new error_response_js_1.NotFoundException("User not found");
        }
        if (!user.confirmedAt) {
            throw new error_response_js_1.BadRequestException("Verify your account first");
        }
        if (!(await (0, hash_security_js_1.compareHash)(password, user.password))) {
            throw new error_response_js_1.NotFoundException("Invalid login data");
        }
        const credential = (0, token_security_js_1.createLoginCredential)(user);
        return res.json({
            message: "Done",
            data: { credentials: credential },
        });
    };
}
exports.default = new AuthenticationService();
