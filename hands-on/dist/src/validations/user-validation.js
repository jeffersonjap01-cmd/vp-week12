"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.REGISTER = zod_1.z.object({
    username: zod_1.z
        .string({
        error: "Username must be string!",
    })
        .min(1, {
        error: "Username can not be empty!",
    }),
    email: zod_1.z
        .email({
        error: "Email format is invalid!",
    })
        .min(1, {
        error: "Email can not be empty!",
    }),
    password: zod_1.z
        .string({
        error: "Password must be string!",
    })
        .min(8, {
        error: "Password must contain more than or equal to 8 characters!",
    }),
});
UserValidation.LOGIN = zod_1.z.object({
    email: zod_1.z
        .email({
        error: "Email format is invalid!",
    })
        .min(1, {
        error: "Email can not be empty!",
    }),
    password: zod_1.z
        .string({
        error: "Password must be string!",
    })
        .min(8, {
        error: "Password must contain more than or equal to 8 characters!",
    }),
});
