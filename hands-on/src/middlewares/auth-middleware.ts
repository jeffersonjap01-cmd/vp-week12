import { NextFunction, Response } from "express";
import { ResponseError } from "../error/response-error";
import { verifyToken } from "../utils/jwt-util";
import { UserRequest } from "../types/user-request";

export const authMiddleware = (
    req: UserRequest,
    _res: Response,
    next: NextFunction
) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseError(401, "Authorization header is missing or invalid");
        }

        const token = authorizationHeader.replace("Bearer", "").trim();

        if (!token) {
            throw new ResponseError(401, "Token is required");
        }

        const payload = verifyToken(token);
        req.user = payload;

        next();
    } catch (error) {
        if (error instanceof ResponseError) {
            next(error);
            return;
        }

        next(new ResponseError(401, "Invalid or expired token"));
    }
};


