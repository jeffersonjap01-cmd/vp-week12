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
exports.TodoService = void 0;
const response_error_1 = require("../error/response-error");
const todo_model_1 = require("../models/todo-model");
const database_util_1 = require("../utils/database-util");
const todo_validation_1 = require("../validations/todo-validation");
const validation_1 = require("../validations/validation");
class TodoService {
    static getAllTodos(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const todos = yield database_util_1.prismaClient.todo.findMany({
                where: { user_id: userId },
                orderBy: { id: "desc" },
            });
            return todos.map(todo_model_1.toTodoResponse);
        });
    }
    static getTodoById(todoId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const todo = yield database_util_1.prismaClient.todo.findFirst({
                where: { id: todoId, user_id: userId },
            });
            if (!todo) {
                throw new response_error_1.ResponseError(404, "Todo not found");
            }
            return (0, todo_model_1.toTodoResponse)(todo);
        });
    }
    static createTodo(userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedData = validation_1.Validation.validate(todo_validation_1.TodoValidation.CREATE, request);
            const todo = yield database_util_1.prismaClient.todo.create({
                data: {
                    title: validatedData.title,
                    description: validatedData.description,
                    priority: validatedData.priority,
                    due_date: validatedData.dueDate,
                    status: validatedData.status,
                    user_id: userId,
                },
            });
            return (0, todo_model_1.toTodoResponse)(todo);
        });
    }
    static updateTodo(todoId, userId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedData = validation_1.Validation.validate(todo_validation_1.TodoValidation.UPDATE, request);
            const todo = yield database_util_1.prismaClient.todo.findUnique({
                where: { id: todoId },
            });
            if (!todo) {
                throw new response_error_1.ResponseError(404, "Todo not found");
            }
            if (todo.user_id !== userId) {
                throw new response_error_1.ResponseError(403, "Unauthorized access");
            }
            const dataToUpdate = {};
            if (validatedData.title !== undefined) {
                dataToUpdate.title = validatedData.title;
            }
            if (validatedData.description !== undefined) {
                dataToUpdate.description = validatedData.description;
            }
            if (validatedData.priority !== undefined) {
                dataToUpdate.priority = validatedData.priority;
            }
            if (validatedData.dueDate !== undefined) {
                dataToUpdate.due_date = validatedData.dueDate;
            }
            if (validatedData.status !== undefined) {
                dataToUpdate.status = validatedData.status;
            }
            const updatedTodo = yield database_util_1.prismaClient.todo.update({
                where: { id: todoId },
                data: dataToUpdate,
            });
            return (0, todo_model_1.toTodoResponse)(updatedTodo);
        });
    }
    static deleteTodo(todoId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const todo = yield database_util_1.prismaClient.todo.findUnique({ where: { id: todoId } });
            if (!todo) {
                throw new response_error_1.ResponseError(404, "Todo not found");
            }
            if (todo.user_id !== userId) {
                throw new response_error_1.ResponseError(403, "Unauthorized access");
            }
            yield database_util_1.prismaClient.todo.delete({
                where: { id: todoId },
            });
        });
    }
}
exports.TodoService = TodoService;
