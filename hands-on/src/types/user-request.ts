import { Request } from "express";
import { UserJWTPayload } from "../models/user-model";

export interface UserRequest extends Request {
    user?: UserJWTPayload;
}


