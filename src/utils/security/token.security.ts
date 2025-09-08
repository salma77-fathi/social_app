import { Secret, sign, SignOptions } from "jsonwebtoken";
import { HUserDocument, RoleEnum } from "../../DB/models/User.model.js";
export enum signatureLevelEnum {
  Bearer = "Bearer",
  System = "System",
}
export const generateToken = async ({
  payload,
  secret = process.env.ACCESS_USER_TOKEN_SIGNATURE as string,
  options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) },
}: {
  payload: object;
  secret?: Secret;
  options?: SignOptions;
}): Promise<string> => {
  return sign(payload, secret, options);
};
export const detectSignatureLevel = async (
  role: RoleEnum = RoleEnum.user
): Promise<signatureLevelEnum> => {
  let signatureLevel: signatureLevelEnum = signatureLevelEnum.Bearer;
  switch (role) {
    case RoleEnum.admin:
      signatureLevel = signatureLevelEnum.System;
      break;
    default:
      signatureLevel = signatureLevelEnum.Bearer;

      break;
  }
  return signatureLevel;
};
export const getSignatures = async (
  signatureLevel: signatureLevelEnum = signatureLevelEnum.Bearer
): Promise<{ accessToken: string; refreshToken: string }> => {
  let signatures: { accessToken: string; refreshToken: string } = {
    accessToken: "",
    refreshToken: "",
  };
  switch (signatureLevel) {
    case signatureLevelEnum.System:
      signatures.accessToken = process.env
        .ACCESS_SYSTEM_TOKEN_SIGNATURE as string;
      signatures.refreshToken = process.env
        .REFRESH_SYSTEM_TOKEN_SIGNATURE as string;
      break;
    default:
      signatures.accessToken = process.env
        .ACCESS_USER_TOKEN_SIGNATURE as string;
      signatures.refreshToken = process.env
        .REFRESH_USER_TOKEN_SIGNATURE as string;

      break;
  }
  return signatures;
};
export const createLoginCredential = async (user: HUserDocument) => {
  const signatureLevel = await detectSignatureLevel(user.role);
  const signatures = await getSignatures(signatureLevel);
  const accessToken = await generateToken({
    payload: { _id: user._id },
    secret: signatures.accessToken,
    options: { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) },
  });
  const refreshToken = await generateToken({
    payload: { _id: user._id },
    secret: signatures.refreshToken,
    options: { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) },
  });
  return { accessToken, refreshToken };
};
