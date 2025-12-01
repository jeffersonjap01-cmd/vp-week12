"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const response_error_1 = require("../error/response-error");
const user_model_1 = require("../models/user-model");
const database_util_1 = require("../utils/database-util");
const user_validation_1 = require("../validations/user-validation");
const validation_1 = require("../validations/validation");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    static register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedData = validation_1.Validation.validate(user_validation_1.UserValidation.REGISTER, request);
            const email = yield database_util_1.prismaClient.user.findFirst({
                where: {
                    email: validatedData.email,
                },
            });
            if (email) {
                throw new response_error_1.ResponseError(400, "Email has already existed!");
            }
            validatedData.password = yield bcryptjs_1.default.hash(validatedData.password, 10);
            const user = yield database_util_1.prismaClient.user.create({
                data: {
                    username: validatedData.username,
                    email: validatedData.email,
                    password: validatedData.password,
                },
            });
            return (0, user_model_1.toUserResponse)(user.id, user.username, user.email);
        });
    }
    static login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedData = validation_1.Validation.validate(user_validation_1.UserValidation.LOGIN, request);
            const user = yield database_util_1.prismaClient.user.findFirst({
                where: {
                    email: validatedData.email,
                },
            });
            if (!user) {
                throw new response_error_1.ResponseError(400, "Invalid email or password!");
            }
            const passwordIsValid = yield bcryptjs_1.default.compare(validatedData.password, user.password);
            if (!passwordIsValid) {
                throw new response_error_1.ResponseError(400, "Invalid email or password!");
            }
            return (0, user_model_1.toUserResponse)(user.id, user.username, user.email);
        });
    }
}
exports.UserService = UserService;
