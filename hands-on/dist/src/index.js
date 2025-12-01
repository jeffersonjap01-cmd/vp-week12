"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middlewares/error-middleware");
const public_api_1 = require("./routes/public-api");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", public_api_1.publicRouter);
app.get("/", (_req, res) => {
    res.send("Server running successfully!");
});
app.use(error_middleware_1.errorMiddleware);
app.listen(env_1.PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${env_1.PORT}`);
});
