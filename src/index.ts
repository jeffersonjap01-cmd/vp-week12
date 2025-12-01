import express from "express";
import cors from "cors";
import { PORT } from "./config/env";
import { errorMiddleware } from "./middlewares/error-middleware";
import { customerRoutes } from "./routes/customers";
import { restaurantRoutes } from "./routes/restaurants";
import { orderRoutes } from "./routes/orders";
import { testConnection } from "./utils/database-util";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// API routes
app.use("/api/customers", customerRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);

// Error handling middleware
app.use(errorMiddleware);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

app.listen(PORT, async () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
  
  // Test database connection
  await testConnection();
});

export default app;