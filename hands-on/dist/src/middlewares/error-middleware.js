"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const response_error_1 = require("../error/response-error");
const errorMiddleware = (err, _req, res, _next) => {
    if (err instanceof response_error_1.ResponseError) {
        return res.status(err.status).json({
            message: err.message,
        });
    }
    console.error(err);
    return res.status(500).json({
        message: "Internal server error",
    });
};
exports.errorMiddleware = errorMiddleware;
