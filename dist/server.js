"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const customers_1 = require("./routes/customers");
const restaurants_1 = require("./routes/restaurants");
const orders_1 = require("./routes/orders");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./middleware/logger");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(logger_1.requestLogger);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
// API routes
app.use('/api/customers', customers_1.customerRoutes);
app.use('/api/restaurants', restaurants_1.restaurantRoutes);
app.use('/api/orders', orders_1.orderRoutes);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📚 API documentation available at http://localhost:${PORT}/api-docs`);
    console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=server.js.map