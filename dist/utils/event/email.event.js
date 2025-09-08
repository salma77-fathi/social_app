"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvent = void 0;
const node_events_1 = require("node:events");
const send_email_js_1 = require("../email/send.email.js");
const verify_template_email_js_1 = require("../email/verify.template.email.js");
exports.emailEvent = new node_events_1.EventEmitter();
exports.emailEvent.on("confirmEmail", async (data) => {
    try {
        data.subject = "Confirm-Email";
        data.html = (0, verify_template_email_js_1.verifyEmail)({ otp: data.otp, title: "Email Confirmation" });
        await (0, send_email_js_1.sendEmail)(data);
    }
    catch (error) {
        console.log(`Fail to send email`, error);
    }
});
