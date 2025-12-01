import express from "express";
import { TodoController } from "../controllers/todo-controller";
import { UserController } from "../controllers/user-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

export const publicRouter = express.Router();

publicRouter.post("/register", UserController.register);
publicRouter.post("/login", UserController.login);

publicRouter.use(authMiddleware);

publicRouter.get("/todos", TodoController.getAllTodos);
publicRouter.get("/todos/:id", TodoController.getTodoById);
publicRouter.post("/todos", TodoController.createTodo);
publicRouter.put("/todos/:id", TodoController.updateTodo);
publicRouter.delete("/todos/:id", TodoController.deleteTodo);
