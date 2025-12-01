import { ResponseError } from "../error/response-error";
import {
    CreateTodoRequest,
    TodoResponse,
    UpdateTodoRequest,
    toTodoResponse,
} from "../models/todo-model";
import { prismaClient } from "../utils/database-util";
import { TodoValidation } from "../validations/todo-validation";
import { Validation } from "../validations/validation";

export class TodoService {
    static async getAllTodos(userId: number): Promise<TodoResponse[]> {
        const todos = await prismaClient.todo.findMany({
            where: { user_id: userId },
            orderBy: { id: "desc" },
        });

        return todos.map(toTodoResponse);
    }

    static async getTodoById(
        todoId: number,
        userId: number
    ): Promise<TodoResponse> {
        const todo = await prismaClient.todo.findFirst({
            where: { id: todoId, user_id: userId },
        });

        if (!todo) {
            throw new ResponseError(404, "Todo not found");
        }

        return toTodoResponse(todo);
    }

    static async createTodo(
        userId: number,
        request: CreateTodoRequest
    ): Promise<TodoResponse> {
        const validatedData = Validation.validate(TodoValidation.CREATE, request);

        const todo = await prismaClient.todo.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                priority: validatedData.priority,
                due_date: validatedData.dueDate,
                status: validatedData.status,
                user_id: userId,
            },
        });

        return toTodoResponse(todo);
    }

    static async updateTodo(
        todoId: number,
        userId: number,
        request: UpdateTodoRequest
    ): Promise<TodoResponse> {
        const validatedData = Validation.validate(TodoValidation.UPDATE, request);

        const todo = await prismaClient.todo.findUnique({
            where: { id: todoId },
        });

        if (!todo) {
            throw new ResponseError(404, "Todo not found");
        }

        if (todo.user_id !== userId) {
            throw new ResponseError(403, "Unauthorized access");
        }

        const dataToUpdate: {
            title?: string;
            description?: string;
            priority?: string;
            due_date?: string;
            status?: string;
        } = {};

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

        const updatedTodo = await prismaClient.todo.update({
            where: { id: todoId },
            data: dataToUpdate,
        });

        return toTodoResponse(updatedTodo);
    }

    static async deleteTodo(todoId: number, userId: number): Promise<void> {
        const todo = await prismaClient.todo.findUnique({ where: { id: todoId } });

        if (!todo) {
            throw new ResponseError(404, "Todo not found");
        }

        if (todo.user_id !== userId) {
            throw new ResponseError(403, "Unauthorized access");
        }

        await prismaClient.todo.delete({
            where: { id: todoId },
        });
    }
}
