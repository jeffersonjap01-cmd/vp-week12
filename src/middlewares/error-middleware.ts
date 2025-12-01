import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../error/response-error";

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ResponseError) {
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