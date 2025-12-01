"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_URL = exports.JWT_SECRET_KEY = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 3000;
exports.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "default_secret";
exports.DATABASE_URL = process.env.DATABASE_URL || "";
console.log("Loaded environment:");
console.log("PORT:", exports.PORT);
console.log("DATABASE_URL:", exports.DATABASE_URL);
