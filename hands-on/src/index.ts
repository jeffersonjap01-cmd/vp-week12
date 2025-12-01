import express from "express";
import { PORT } from "./config/env";
import { errorMiddleware } from "./middlewares/error-middleware";
import { publicRouter } from "./routes/public-api";
import { getCurrentReadableTime } from "./utils/time-formatter";

const app = express();
app.use(express.json());
app.use("/api", publicRouter);

app.get("/", (_req, res) => {
    res.send("Server running successfully!");
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log(`Server started at: ${getCurrentReadableTime()}`);
});
