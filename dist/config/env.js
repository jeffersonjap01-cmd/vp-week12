"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3000,
    databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:5991@localhost:5432/todo_list",
    jwtSecret: process.env.JWT_SECRET_KEY || "supersecretkey123",
    nodeEnv: process.env.NODE_ENV || "development",
    corsOrigin: ((_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(',')) || ['http://localhost:3000']
};
exports.PORT = exports.config.port;
