import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import healthRoute from "./routes/health";
import authRoutes from "./routes/auth";
import protectedRoute from "./routes/protected";
import destinationRoutes from "./routes/destinations";
import { corsOptions, secrets } from "./config";

dotenv.config();
const app = express();

// Middleware
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoute);
app.use("/api/protected", protectedRoute);
app.use("/api/destinations", destinationRoutes);

// DB + Server
connectDB().then(() => {
	app.listen(secrets.port, () => {
		console.log(`Server running on http://localhost:${secrets.port}`);
	});
});
