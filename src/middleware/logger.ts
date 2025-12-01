import { Request, Response, NextFunction } from 'express'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString()
  const method = req.method
  const url = req.originalUrl
  const ip = req.ip || req.connection.remoteAddress
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`)
  
  // Log response status
  const originalSend = res.send
  res.send = function (data) {
    const responseTime = Date.now() - (req as any).startTime
    console.log(`[${timestamp}] ${method} ${url} - Status: ${res.statusCode} - Response Time: ${responseTime}ms`)
    return originalSend.call(this, data)
  }
  
  ;(req as any).startTime = Date.now()
  next()
}