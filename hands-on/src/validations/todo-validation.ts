import { z, ZodType } from "zod";

const todoSchema = z.object({
    title: z.string().min(1, "Title cannot be empty"),
    description: z.string().min(1, "Description cannot be empty"),
    priority: z.string().min(1, "Priority cannot be empty"),
    dueDate: z.string().min(1, "Due date cannot be empty"),
    status: z.string().min(1, "Status cannot be empty"),
});

export class TodoValidation {
    static readonly CREATE: ZodType = todoSchema;
    static readonly UPDATE: ZodType = todoSchema.partial().refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field must be provided",
        }
    );
}

