
import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer/index.js";
import { BadRequestException } from "../response/error.response.js";

export const sendEmail = async (data: Mail.Options): Promise<void> => {
  if (!data.html && data.attachments?.length && data.text) {
    throw new BadRequestException("missing email content");
  }
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL as string,
      pass: process.env.APP_PASSWORD as string,
    },
  });
  const info = await transporter.sendMail({
    ...data,
    from: `"Social App 💖" <${process.env.APP_EMAIL as string}>`,
  });
  console.log("message:", info.messageId);
};
