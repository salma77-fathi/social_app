import { EventEmitter } from "node:events";
import Mail from "nodemailer/lib/mailer/index.js";
import { sendEmail } from "../email/send.email.js";
import { verifyEmail } from "../email/verify.template.email.js";
export const emailEvent = new EventEmitter();
interface IEmail extends Mail.Options{
  otp:number
}
emailEvent.on("confirmEmail", async (data: IEmail) => {
  try {
    data.subject = "Confirm-Email";
    data.html=verifyEmail({otp:data.otp ,title:"Email Confirmation" })
    await sendEmail(data);
  } catch (error) {
    console.log(`Fail to send email`, error);
  }
});
