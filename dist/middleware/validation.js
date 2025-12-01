"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        const errors = [];
        // Validate body
        if (schema.body) {
            for (const rule of schema.body) {
                const value = req.body[rule.field];
                if (rule.required && (value === undefined || value === null || value === '')) {
                    errors.push(`${rule.field} is required`);
                    continue;
                }
                if (value !== undefined && value !== null && value !== '') {
                    // Type validation
                    if (rule.type === 'email' && !isValidEmail(value)) {
                        errors.push(`${rule.field} must be a valid email`);
                    }
                    if (rule.type === 'phone' && !isValidPhone(value)) {
                        errors.push(`${rule.field} must be a valid phone number`);
                    }
                    if (rule.type === 'string' && typeof value !== 'string') {
                        errors.push(`${rule.field} must be a string`);
                    }
                    if (rule.type === 'number' && typeof value !== 'number') {
                        errors.push(`${rule.field} must be a number`);
                    }
                    if (rule.type === 'boolean' && typeof value !== 'boolean') {
                        errors.push(`${rule.field} must be a boolean`);
                    }
                    // Length validation for strings
                    if (rule.type === 'string' && typeof value === 'string') {
                        if (rule.minLength && value.length < rule.minLength) {
                            errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
                        }
                        if (rule.maxLength && value.length > rule.maxLength) {
                            errors.push(`${rule.field} must not exceed ${rule.maxLength} characters`);
                        }
                    }
                    // Range validation for numbers
                    if (rule.type === 'number' && typeof value === 'number') {
                        if (rule.min !== undefined && value < rule.min) {
                            errors.push(`${rule.field} must be at least ${rule.min}`);
                        }
                        if (rule.max !== undefined && value > rule.max) {
                            errors.push(`${rule.field} must not exceed ${rule.max}`);
                        }
                    }
                }
            }
        }
        // Validate query parameters
        if (schema.query) {
            for (const rule of schema.query) {
                const value = req.query[rule.field];
                if (rule.required && (value === undefined || value === null || value === '')) {
                    errors.push(`${rule.field} is required`);
                    continue;
                }
            }
        }
        // Validate params
        if (schema.params) {
            for (const rule of schema.params) {
                const value = req.params[rule.field];
                if (rule.required && (value === undefined || value === null || value === '')) {
                    errors.push(`${rule.field} is required`);
                    continue;
                }
            }
        }
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }
        next();
    };
};
exports.validate = validate;
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}
