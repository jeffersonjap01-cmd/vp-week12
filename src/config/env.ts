import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || "postgresql://postgres:5991@localhost:5432/todo_list",
  jwtSecret: process.env.JWT_SECRET_KEY || "supersecretkey123",
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000']
};

export const PORT = config.port;