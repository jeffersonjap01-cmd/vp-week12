import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../error/response-error";

export const errorMiddleware = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof ResponseError) {
        return res.status(err.status).json({
            message: err.message,
        });
    }

    console.error(err);

    return res.status(500).json({
        message: "Internal server error",
    });
};


