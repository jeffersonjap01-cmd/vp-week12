"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
    // Log response status
    const originalSend = res.send;
    res.send = function (data) {
        const responseTime = Date.now() - req.startTime;
        console.log(`[${timestamp}] ${method} ${url} - Status: ${res.statusCode} - Response Time: ${responseTime}ms`);
        return originalSend.call(this, data);
    };
    req.startTime = Date.now();
    next();
};
exports.requestLogger = requestLogger;
