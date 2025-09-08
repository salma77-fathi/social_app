import { email, z } from "zod";
import { generalFields } from "../../middleware/validation.middleware.js";

export const login = {
  body: z.strictObject({
    email: generalFields.email,
    password: generalFields.password,
  }),
};

export const signup = {
  body: login.body
    .extend({
      username: generalFields.username,
      confirmPassword: generalFields.confirmPassword,
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
export const confirmEmail = {
  body: z.strictObject({
      email: generalFields.email,
      otp: generalFields.otp,
    })
    
};
//_____________________________notes___________________________________________
// here to validate only on one field
// .refine(
//   (data) => {
//     return data.confirmPassword === data.password;
//   },
//   { error: "password mismatch confirmPassword" }
// ),

/*here for more than one*/
// .superRefine((data, ctx) => {
//   if (data.confirmPassword !== data.password) {
//     ctx.addIssue({
//       code: "custom",
//       path: ["confirmPassword"],
//       message: "password mismatch confirmPassword",
//     });
//   }
//   // if (data.username.split(" ")?.length !=2) {
//   //   ctx.addIssue({
//   //     code: "custom",
//   //     path: ["username"],
//   //     message: "username is too small",
//   //   });
//   // }
// }),
