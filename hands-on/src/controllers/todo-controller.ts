import { NextFunction, Response } from "express";
import { ResponseError } from "../error/response-error";
import {
    CreateTodoRequest,
    UpdateTodoRequest,
} from "../models/todo-model";
import { UserRequest } from "../types/user-request";
import { TodoService } from "../services/todo-service";

const extractUserId = (req: UserRequest): number => {
    const userId = req.user?.id;

    if (!userId) {
        throw new ResponseError(401, "Unauthorized");
    }

    return userId;
};

const parseTodoId = (value: string): number => {
    const todoId = Number(value);

    if (!Number.isInteger(todoId) || todoId <= 0) {
        throw new ResponseError(400, "Todo id must be a positive integer");
    }

    return todoId;
};

export class TodoController {
    static async getAllTodos(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const todos = await TodoService.getAllTodos(extractUserId(req));
            return res.status(200).json({
                message: "Success fetching todos",
                data: todos,
            });
        } catch (error) {
            next(error);
        }
    }

    static async getTodoById(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const todoId = parseTodoId(req.params.id);
            const todo = await TodoService.getTodoById(todoId, extractUserId(req));
            return res.status(200).json({
                message: "Success fetching todo",
                data: todo,
            });
        } catch (error) {
            next(error);
        }
    }

    static async createTodo(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const todo = await TodoService.createTodo(
                extractUserId(req),
                req.body as CreateTodoRequest
            );
            return res.status(201).json({
                message: "Todo created",
                data: todo,
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateTodo(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const todoId = parseTodoId(req.params.id);
            const todo = await TodoService.updateTodo(
                todoId,
                extractUserId(req),
                req.body as UpdateTodoRequest
            );

            return res.status(200).json({
                message: "Todo updated",
                data: todo,
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteTodo(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const todoId = parseTodoId(req.params.id);
            await TodoService.deleteTodo(todoId, extractUserId(req));

            return res.status(200).json({
                message: "Todo deleted",
            });
        } catch (error) {
            next(error);
        }
    }
}
