"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoginCredential = exports.getSignatures = exports.detectSignatureLevel = exports.generateToken = exports.signatureLevelEnum = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const User_model_js_1 = require("../../DB/models/User.model.js");
var signatureLevelEnum;
(function (signatureLevelEnum) {
    signatureLevelEnum["Bearer"] = "Bearer";
    signatureLevelEnum["System"] = "System";
})(signatureLevelEnum || (exports.signatureLevelEnum = signatureLevelEnum = {}));
const generateToken = async ({ payload, secret = process.env.ACCESS_USER_TOKEN_SIGNATURE, options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) }, }) => {
    return (0, jsonwebtoken_1.sign)(payload, secret, options);
};
exports.generateToken = generateToken;
const detectSignatureLevel = async (role = User_model_js_1.RoleEnum.user) => {
    let signatureLevel = signatureLevelEnum.Bearer;
    switch (role) {
        case User_model_js_1.RoleEnum.admin:
            signatureLevel = signatureLevelEnum.System;
            break;
        default:
            signatureLevel = signatureLevelEnum.Bearer;
            break;
    }
    return signatureLevel;
};
exports.detectSignatureLevel = detectSignatureLevel;
const getSignatures = async (signatureLevel = signatureLevelEnum.Bearer) => {
    let signatures = {
        accessToken: "",
        refreshToken: "",
    };
    switch (signatureLevel) {
        case signatureLevelEnum.System:
            signatures.accessToken = process.env
                .ACCESS_SYSTEM_TOKEN_SIGNATURE;
            signatures.refreshToken = process.env
                .REFRESH_SYSTEM_TOKEN_SIGNATURE;
            break;
        default:
            signatures.accessToken = process.env
                .ACCESS_USER_TOKEN_SIGNATURE;
            signatures.refreshToken = process.env
                .REFRESH_USER_TOKEN_SIGNATURE;
            break;
    }
    return signatures;
};
exports.getSignatures = getSignatures;
const createLoginCredential = async (user) => {
    const signatureLevel = await (0, exports.detectSignatureLevel)(user.role);
    const signatures = await (0, exports.getSignatures)(signatureLevel);
    const accessToken = await (0, exports.generateToken)({
        payload: { _id: user._id },
        secret: signatures.accessToken,
        options: { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) },
    });
    const refreshToken = await (0, exports.generateToken)({
        payload: { _id: user._id },
        secret: signatures.refreshToken,
        options: { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) },
    });
    return { accessToken, refreshToken };
};
exports.createLoginCredential = createLoginCredential;
