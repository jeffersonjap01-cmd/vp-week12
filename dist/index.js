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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middlewares/error-middleware");
const customers_1 = require("./routes/customers");
const restaurants_1 = require("./routes/restaurants");
const orders_1 = require("./routes/orders");
const database_util_1 = require("./utils/database-util");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ((_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(',')) || ['http://localhost:3000'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// API routes
app.use("/api/customers", customers_1.customerRoutes);
app.use("/api/restaurants", restaurants_1.restaurantRoutes);
app.use("/api/orders", orders_1.orderRoutes);
// Error handling middleware
app.use(error_middleware_1.errorMiddleware);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});
app.listen(env_1.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🚀 Server is running at http://localhost:${env_1.PORT}`);
    console.log(`🔍 Health check available at http://localhost:${env_1.PORT}/health`);
    // Test database connection
    yield (0, database_util_1.testConnection)();
}));
exports.default = app;
