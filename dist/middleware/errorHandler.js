"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    var _a;
    console.error('Error:', err);
    // Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaError = err;
        switch (prismaError.code) {
            case 'P2002':
                return res.status(409).json({
                    success: false,
                    message: 'A record with this value already exists',
                    field: (_a = prismaError.meta) === null || _a === void 0 ? void 0 : _a.target
                });
            case 'P2025':
                return res.status(404).json({
                    success: false,
                    message: 'Record not found'
                });
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Database operation failed'
                });
        }
    }
    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            details: err.message
        });
    }
    // Default error response
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json(Object.assign({ success: false, message }, (process.env.NODE_ENV === 'development' && { stack: err.stack })));
};
exports.errorHandler = errorHandler;
