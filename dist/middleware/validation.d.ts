import { Request, Response, NextFunction } from 'express';
interface ValidationRule {
    field: string;
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'email' | 'phone';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}
interface ValidationSchema {
    body?: ValidationRule[];
    query?: ValidationRule[];
    params?: ValidationRule[];
}
export declare const validate: (schema: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=validation.d.ts.map