"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const response_error_1 = require("../error/response-error");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof response_error_1.ResponseError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};
exports.errorMiddleware = errorMiddleware;
