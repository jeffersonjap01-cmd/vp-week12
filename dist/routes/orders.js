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
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = require("express");
const database_util_1 = require("../utils/database-util");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
exports.orderRoutes = router;
// Helper function to calculate ETA (10 minutes per item + 10 minutes delivery)
function calculateETA(itemCount) {
    const baseTime = 10; // base 10 minutes for delivery
    const timePerItem = 10; // 10 minutes per item
    const totalMinutes = baseTime + (itemCount * timePerItem);
    const eta = new Date();
    eta.setMinutes(eta.getMinutes() + totalMinutes);
    return eta;
}
/**
 * @route   GET /api/orders
 * @desc    Get all orders with optional filtering
 * @access  Public
 * @query   ?customerId=id - Filter by customer
 * @query   ?restaurantId=id - Filter by restaurant
 */
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId, restaurantId } = req.query;
        const where = {};
        if (customerId) {
            where.customerId = customerId;
        }
        if (restaurantId) {
            where.restaurantId = restaurantId;
        }
        const orders = yield database_util_1.prisma.order.findMany({
            where,
            include: {
                customer: true,
                restaurant: true
            },
            orderBy: {
                orderedAt: 'desc'
            }
        });
        res.status(200).json({
            success: true,
            data: orders,
            count: orders.length,
            filters: Object.assign(Object.assign({}, (customerId && { customerId })), (restaurantId && { restaurantId }))
        });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @route   GET /api/orders/customer/:customerId
 * @desc    Get orders by customer
 * @access  Public
 */
router.get('/customer/:customerId', (0, validation_1.validate)({
    params: [
        { field: 'customerId', required: true }
    ]
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        // Check if customer exists
        const customer = yield database_util_1.prisma.customer.findUnique({
            where: { id: customerId }
        });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }
        const orders = yield database_util_1.prisma.order.findMany({
            where: { customerId },
            include: {
                restaurant: true
            },
            orderBy: {
                orderedAt: 'desc'
            }
        });
        res.status(200).json({
            success: true,
            data: orders,
            customer: customer,
            count: orders.length
        });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @route   GET /api/orders/restaurant/:restaurantId
 * @desc    Get orders by restaurant
 * @access  Public
 */
router.get('/restaurant/:restaurantId', (0, validation_1.validate)({
    params: [
        { field: 'restaurantId', required: true }
    ]
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId } = req.params;
        // Check if restaurant exists
        const restaurant = yield database_util_1.prisma.restaurant.findUnique({
            where: { id: restaurantId }
        });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        const orders = yield database_util_1.prisma.order.findMany({
            where: { restaurantId },
            include: {
                customer: true
            },
            orderBy: {
                orderedAt: 'desc'
            }
        });
        res.status(200).json({
            success: true,
            data: orders,
            restaurant: restaurant,
            count: orders.length
        });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @route   POST /api/orders
 * @desc    Create a new order with ETA calculation
 * @access  Public
 */
router.post('/', (0, validation_1.validate)({
    body: [
        { field: 'customerId', required: true },
        { field: 'restaurantId', required: true },
        { field: 'itemCount', required: true, type: 'number', min: 1, max: 50 }
    ]
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId, restaurantId, itemCount } = req.body;
        // Verify customer exists
        const customer = yield database_util_1.prisma.customer.findUnique({
            where: { id: customerId }
        });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }
        // Verify restaurant exists and is open
        const restaurant = yield database_util_1.prisma.restaurant.findUnique({
            where: { id: restaurantId }
        });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        if (!restaurant.isOpen) {
            return res.status(400).json({
                success: false,
                message: 'Restaurant is currently closed'
            });
        }
        // Calculate ETA
        const eta = calculateETA(itemCount);
        const order = yield database_util_1.prisma.order.create({
            data: {
                customerId,
                restaurantId,
                itemCount,
                eta,
                orderedAt: new Date()
            },
            include: {
                customer: true,
                restaurant: true
            }
        });
        res.status(201).json({
            success: true,
            data: order,
            message: 'Order created successfully',
            etaCalculation: {
                baseTime: '10 minutes',
                timePerItem: '10 minutes',
                itemCount,
                totalEstimatedTime: `${10 + (itemCount * 10)} minutes`
            }
        });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Public
 */
router.get('/:id', (0, validation_1.validate)({
    params: [
        { field: 'id', required: true }
    ]
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield database_util_1.prisma.order.findUnique({
            where: { id },
            include: {
                customer: true,
                restaurant: true
            }
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        res.status(200).json({
            success: true,
            data: order
        });
    }
    catch (error) {
        next(error);
    }
}));
