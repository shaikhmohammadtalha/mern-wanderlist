import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import healthRoute from "./routes/health";
import authRoutes from "./routes/auth"
import protectedRoute from "./routes/protected";
import destinationRoutes from "./routes/destinations";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes)

// Routes
app.use("/api/health", healthRoute);

app.use("/api/protected", protectedRoute);

app.use("/api/destinations", destinationRoutes);

// DB + Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
