import { string } from "zod"
import { generateToken } from "../utils/jwt-util"
import { formatDateTime } from "../utils/time-formatter"

export interface UserJWTPayload {
    id: number
    username: string
    email: string
}

export interface RegisterUserRequest {
    username: string
    email: string
    password: string
}

export interface LoginUserRequest {
    email: string
    password: string
}

export interface UserResponse {
    token?: string
    createdAt?: string
    updatedAt?: string
}

export function toUserResponse(
    id: number,
    username: string,
    email: string,
    createdAt?: Date,
    updatedAt?: Date
): UserResponse {
    const response: UserResponse = {
        token: generateToken(
            {
                id: id,
                username: username,
                email: email,
            },
            "1h"
        ),
    };

    // Add formatted timestamps if provided
    if (createdAt) {
        response.createdAt = formatDateTime(createdAt, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    }

    if (updatedAt) {
        response.updatedAt = formatDateTime(updatedAt, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    }

    return response;
}