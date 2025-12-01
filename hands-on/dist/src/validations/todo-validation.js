"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoValidation = void 0;
const zod_1 = require("zod");
const todoSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title cannot be empty"),
    description: zod_1.z.string().min(1, "Description cannot be empty"),
    priority: zod_1.z.string().min(1, "Priority cannot be empty"),
    dueDate: zod_1.z.string().min(1, "Due date cannot be empty"),
    status: zod_1.z.string().min(1, "Status cannot be empty"),
});
class TodoValidation {
}
exports.TodoValidation = TodoValidation;
TodoValidation.CREATE = todoSchema;
TodoValidation.UPDATE = todoSchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});
