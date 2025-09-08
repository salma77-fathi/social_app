import { NextFunction, Request, Response } from "express";
import type { ZodError, ZodType } from "zod";
import { z } from "zod";
import { BadRequestException } from "../utils/response/error.response.js";

type KeyReqType = keyof Request; // this line is about=>'body'|'params'|'query'|'file'
type SchemaType = Partial<Record<KeyReqType, ZodType>>; // here to make sure that not have to get all the keys at the same time{optional}
type ValidationErrorsType = Array<{
  key: KeyReqType;
  issues: Array<{
    message: string;
    path: string | number | symbol | undefined;
  }>;
}>;

export const validation = (schema: SchemaType) => {
  return (req: Request, res: Response, next: NextFunction): NextFunction => {
    console.log(schema);
    console.log(Object.keys(schema));

    const validationErrors: ValidationErrorsType = [];

    for (const key of Object.keys(schema) as KeyReqType[]) {
      if (!schema[key]) continue;
      const validationResult = schema[key].safeParse(req[key]);
      if (!validationResult.success) {
        const errors = validationResult.error as ZodError;

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
      throw new BadRequestException("validation error", {
        errors: validationErrors,
      });
    }

    return next() as unknown as NextFunction;
  };
};

export const generalFields = {
  username: z
    .string({ error: "User name is required" })
    .min(2, { error: "min length is 2 char" })
    .max(20, { error: "max length is 20 char" }),
  email: z.email({ error: "make sure the email is correct" }),
  otp: z.string().regex(/^\d{6}$/),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/),
  confirmPassword: z.string(),
};
