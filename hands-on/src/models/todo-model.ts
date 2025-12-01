export interface CreateTodoRequest {
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    status: string;
}

export interface UpdateTodoRequest {
    title?: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    status?: string;
}

import { formatDateTime } from "../utils/time-formatter";

export interface TodoResponse {
    id: number;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
}

type TodoRecord = {
    id: number;
    title: string;
    description: string;
    priority: string;
    due_date: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    user_id: number;
};

export const toTodoResponse = (todo: TodoRecord): TodoResponse => {
    return {
        id: todo.id,
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        dueDate: formatDateTime(new Date(todo.due_date), {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        }),
        status: todo.status,
        createdAt: todo.createdAt ? formatDateTime(todo.createdAt, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        }) : 'N/A',
        updatedAt: todo.updatedAt ? formatDateTime(todo.updatedAt, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        }) : 'N/A',
        userId: todo.user_id,
    };
};


