import dotenv from "dotenv";
import { getCurrentReadableTime } from "../utils/time-formatter";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "default_secret";
export const DATABASE_URL = process.env.DATABASE_URL || "";

console.log("Loaded environment:");
console.log("Current time:", getCurrentReadableTime());
console.log("PORT:", PORT);
console.log("DATABASE_URL:", DATABASE_URL);