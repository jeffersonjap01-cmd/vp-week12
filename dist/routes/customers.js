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
exports.customerRoutes = void 0;
const express_1 = require("express");
const database_util_1 = require("../utils/database-util");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
exports.customerRoutes = router;
/**
 * @route   GET /api/customers
 * @desc    Get all customers
 * @access  Public
 */
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield database_util_1.prisma.customer.findMany({
            include: {
                restaurants: {
                    include: {
                        restaurant: true
                    }
                },
                orders: {
                    include: {
                        restaurant: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json({
            success: true,
            data: customers,
            count: customers.length
        });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @route   POST /api/customers
 * @desc    Create a new customer
 * @access  Public
 */
router.post('/', (0, validation_1.validate)({
    body: [
        { field: 'name', required: true, type: 'string', minLength: 2, maxLength: 100 },
        { field: 'phone', required: true, type: 'phone', minLength: 10, maxLength: 15 }
    ]
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone } = req.body;
        const customer = yield database_util_1.prisma.customer.create({
            data: {
                name,
                phone
            }
        });
        res.status(201).json({
            success: true,
            data: customer,
            message: 'Customer created successfully'
        });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @route   GET /api/customers/:id
 * @desc    Get customer by ID
 * @access  Public
 */
router.get('/:id', (0, validation_1.validate)({
    params: [
        { field: 'id', required: true }
    ]
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const customer = yield database_util_1.prisma.customer.findUnique({
            where: { id },
            include: {
                restaurants: {
                    include: {
                        restaurant: true
                    }
                },
                orders: {
                    include: {
                        restaurant: true
                    },
                    orderBy: {
                        orderedAt: 'desc'
                    }
                }
            }
        });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }
        res.status(200).json({
            success: true,
            data: customer
        });
    }
    catch (error) {
        next(error);
    }
}));
/**
 * @route   PUT /api/customers/:id
 * @desc    Update customer
 * @access  Public
 */
router.put('/:id', (0, validation_1.validate)({
    params: [
        { field: 'id', required: true }
    ],
    body: [
        { field: 'name', required: false, type: 'string', minLength: 2, maxLength: 100 },
        { field: 'phone', required: false, type: 'phone', minLength: 10, maxLength: 15 }
    ]
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, phone } = req.body;
        console.log(`[UPDATE CUSTOMER] Attempting to update customer ${id} with data:`, { name, phone });
        // Check if customer exists
        const existingCustomer = yield database_util_1.prisma.customer.findUnique({
            where: { id }
        });
        if (!existingCustomer) {
            console.log(`[UPDATE CUSTOMER] Customer ${id} not found`);
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }
        console.log(`[UPDATE CUSTOMER] Found existing customer:`, existingCustomer);
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (phone !== undefined)
            updateData.phone = phone;
        console.log(`[UPDATE CUSTOMER] Update data:`, updateData);
        // Ensure we have data to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields provided for update'
            });
        }
        const customer = yield database_util_1.prisma.customer.update({
            where: { id },
            data: updateData
        });
        console.log(`[UPDATE CUSTOMER] Successfully updated customer:`, customer);
        res.status(200).json({
            success: true,
            data: customer,
            message: 'Customer updated successfully'
        });
    }
    catch (error) {
        console.error(`[UPDATE CUSTOMER] Error updating customer:`, error);
        next(error);
    }
}));
/**
 * @route   DELETE /api/customers/:id
 * @desc    Delete customer
 * @access  Public
 */
router.delete('/:id', (0, validation_1.validate)({
    params: [
        { field: 'id', required: true }
    ]
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if customer exists
        const existingCustomer = yield database_util_1.prisma.customer.findUnique({
            where: { id }
        });
        if (!existingCustomer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }
        yield database_util_1.prisma.customer.delete({
            where: { id }
        });
        res.status(200).json({
            success: true,
            message: 'Customer deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
}));
