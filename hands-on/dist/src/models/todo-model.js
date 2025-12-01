"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTodoResponse = void 0;
const toTodoResponse = (todo) => ({
    id: todo.id,
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    dueDate: todo.due_date,
    status: todo.status,
    userId: todo.user_id,
});
exports.toTodoResponse = toTodoResponse;
