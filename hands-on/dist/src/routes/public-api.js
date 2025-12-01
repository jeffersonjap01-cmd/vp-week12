"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRouter = void 0;
const express_1 = __importDefault(require("express"));
const todo_controller_1 = require("../controllers/todo-controller");
const user_controller_1 = require("../controllers/user-controller");
const auth_middleware_1 = require("../middlewares/auth-middleware");
exports.publicRouter = express_1.default.Router();
exports.publicRouter.post("/register", user_controller_1.UserController.register);
exports.publicRouter.post("/login", user_controller_1.UserController.login);
exports.publicRouter.use(auth_middleware_1.authMiddleware);
exports.publicRouter.get("/todos", todo_controller_1.TodoController.getAllTodos);
exports.publicRouter.get("/todos/:id", todo_controller_1.TodoController.getTodoById);
exports.publicRouter.post("/todos", todo_controller_1.TodoController.createTodo);
exports.publicRouter.put("/todos/:id", todo_controller_1.TodoController.updateTodo);
exports.publicRouter.delete("/todos/:id", todo_controller_1.TodoController.deleteTodo);
