import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { UserJWTPayload } from "../models/user-model";
import { JWT_SECRET_KEY } from "../config/env";

const SECRET_KEY: Secret = JWT_SECRET_KEY || "secret_key";

export const generateToken = (
    payload: UserJWTPayload,
    expiryTime: SignOptions["expiresIn"] = "1h"
): string => {
    return jwt.sign(payload, SECRET_KEY, {
        expiresIn: expiryTime,
    });
};

export const verifyToken = (token: string): UserJWTPayload => {
    return jwt.verify(token, SECRET_KEY) as UserJWTPayload;
};