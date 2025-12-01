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
exports.TodoController = void 0;
const response_error_1 = require("../error/response-error");
const todo_service_1 = require("../services/todo-service");
const extractUserId = (req) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new response_error_1.ResponseError(401, "Unauthorized");
    }
    return userId;
};
const parseTodoId = (value) => {
    const todoId = Number(value);
    if (!Number.isInteger(todoId) || todoId <= 0) {
        throw new response_error_1.ResponseError(400, "Todo id must be a positive integer");
    }
    return todoId;
};
class TodoController {
    static getAllTodos(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todos = yield todo_service_1.TodoService.getAllTodos(extractUserId(req));
                return res.status(200).json({
                    message: "Success fetching todos",
                    data: todos,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getTodoById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todoId = parseTodoId(req.params.id);
                const todo = yield todo_service_1.TodoService.getTodoById(todoId, extractUserId(req));
                return res.status(200).json({
                    message: "Success fetching todo",
                    data: todo,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static createTodo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todo = yield todo_service_1.TodoService.createTodo(extractUserId(req), req.body);
                return res.status(201).json({
                    message: "Todo created",
                    data: todo,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateTodo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todoId = parseTodoId(req.params.id);
                const todo = yield todo_service_1.TodoService.updateTodo(todoId, extractUserId(req), req.body);
                return res.status(200).json({
                    message: "Todo updated",
                    data: todo,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteTodo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const todoId = parseTodoId(req.params.id);
                yield todo_service_1.TodoService.deleteTodo(todoId, extractUserId(req));
                return res.status(200).json({
                    message: "Todo deleted",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TodoController = TodoController;
