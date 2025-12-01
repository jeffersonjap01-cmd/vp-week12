"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtUtil = void 0;
// JWT utility - simplified for now
exports.jwtUtil = {
    sign: (payload, expiresIn = "24h") => {
        // TODO: Implement JWT signing when needed
        return JSON.stringify(payload);
    },
    verify: (token) => {
        // TODO: Implement JWT verification when needed
        return JSON.parse(token);
    }
};
