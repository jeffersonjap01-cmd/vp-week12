"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const response_error_1 = require("../error/response-error");
const jwt_util_1 = require("../utils/jwt-util");
const authMiddleware = (req, _res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            throw new response_error_1.ResponseError(401, "Authorization header is missing or invalid");
        }
        const token = authorizationHeader.replace("Bearer", "").trim();
        if (!token) {
            throw new response_error_1.ResponseError(401, "Token is required");
        }
        const payload = (0, jwt_util_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        if (error instanceof response_error_1.ResponseError) {
            next(error);
            return;
        }
        next(new response_error_1.ResponseError(401, "Invalid or expired token"));
    }
};
exports.authMiddleware = authMiddleware;
