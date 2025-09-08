// data to object
// export interface ISignupBodyInputsDTO {
//   username: string;
//   email: string;
//   password: string;
// }
import * as validators from "./auth.validation.js";
import { z } from "zod";

export type ISignupBodyInputsDTO = z.infer<typeof validators.signup.body>;
export type IConfirmEmailBodyInputsDTO = z.infer<
  typeof validators.confirmEmail.body
>;
export type ILoginBodyInputsDTO = z.infer<typeof validators.login.body>;
