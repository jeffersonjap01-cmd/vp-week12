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
exports.restaurantRoutes = void 0;
const express_1 = require("express");
const database_util_1 = require("../utils/database-util");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
exports.restaurantRoutes = router;
/**
 * @route   GET /api/restaurants
 * @desc    Get all restaurants with optional filtering
 * @access  Public
 * @query   ?status=open|closed - Filter by open/closed status
 */
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.query;
        const where = {};
        // Filter by open/closed status if provided
        if (status === 'open') {
            where.isOpen = true;
        }
        else if (status === 'closed') {
            where.isOpen = false;
        }
        const restaurants = yield database_util_1.prisma.restaurant.findMany({
            where,
            include: {
                customers: {
                    include: {
                        customer: true
                    }
                },
                orders: {
                    include: {
                        customer: true
                    },
                    orderBy: {
                        orderedAt: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json({
            success: true,
            data: restaurants,
            count: restaurants.length,
            filters: status ? { status } : {}
        });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @route   POST /api/restaurants
 * @desc    Create a new restaurant
 * @access  Public
 */
router.post('/', (0, validation_1.validate)({
    body: [
        { field: 'name', required: true, type: 'string', minLength: 2, maxLength: 100 },
        { field: 'description', required: true, type: 'string', minLength: 10, maxLength: 500 },
        { field: 'isOpen', required: false, type: 'boolean' }
    ]
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, isOpen = false } = req.body;
        const restaurant = yield database_util_1.prisma.restaurant.create({
            data: {
                name,
                description,
                isOpen
            }
        });
        res.status(201).json({
            success: true,
            data: restaurant,
            message: 'Restaurant created successfully'
        });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @route   GET /api/restaurants/:id
 * @desc    Get restaurant by ID
 * @access  Public
 */
router.get('/:id', (0, validation_1.validate)({
    params: [
        { field: 'id', required: true }
    ]
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const restaurant = yield database_util_1.prisma.restaurant.findUnique({
            where: { id },
            include: {
                customers: {
                    include: {
                        customer: true
                    }
                },
                orders: {
                    include: {
                        customer: true
                    },
                    orderBy: {
                        orderedAt: 'desc'
                    }
                }
            }
        });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        res.status(200).json({
            success: true,
            data: restaurant
        });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @route   PUT /api/restaurants/:id
 * @desc    Update restaurant
 * @access  Public
 */
router.put('/:id', (0, validation_1.validate)({
    params: [
        { field: 'id', required: true }
    ],
    body: [
        { field: 'name', required: false, type: 'string', minLength: 2, maxLength: 100 },
        { field: 'description', required: false, type: 'string', minLength: 10, maxLength: 500 },
        { field: 'isOpen', required: false, type: 'boolean' }
    ]
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, isOpen } = req.body;
        // Check if restaurant exists
        const existingRestaurant = yield database_util_1.prisma.restaurant.findUnique({
            where: { id }
        });
        if (!existingRestaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (isOpen !== undefined)
            updateData.isOpen = isOpen;
        const restaurant = yield database_util_1.prisma.restaurant.update({
            where: { id },
            data: updateData
        });
        res.status(200).json({
            success: true,
            data: restaurant,
            message: 'Restaurant updated successfully'
        });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @route   DELETE /api/restaurants/:id
 * @desc    Delete restaurant
 * @access  Public
 */
router.delete('/:id', (0, validation_1.validate)({
    params: [
        { field: 'id', required: true }
    ]
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if restaurant exists
        const existingRestaurant = yield database_util_1.prisma.restaurant.findUnique({
            where: { id }
        });
        if (!existingRestaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        yield database_util_1.prisma.restaurant.delete({
            where: { id }
        });
        res.status(200).json({
            success: true,
            message: 'Restaurant deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
}));
