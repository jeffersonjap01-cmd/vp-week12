import { Request, Response, NextFunction } from 'express'

interface CustomError extends Error {
  statusCode?: number
  code?: string
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err)

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any
    switch (prismaError.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          message: 'A record with this value already exists',
          field: prismaError.meta?.target
        })
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Record not found'
        })
      default:
        return res.status(400).json({
          success: false,
          message: 'Database operation failed'
        })
    }
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: err.message
    })
  }

  // Default error response
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}