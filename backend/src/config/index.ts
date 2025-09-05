// src/config/index.ts
import { config } from "dotenv";
config();

export const secrets = {
	port: process.env.PORT || 5000,
	jwtSecret: process.env.JWT_SECRET || "changeme",
	mongoUri: process.env.MONGO_URI || "",
	nodeEnv: process.env.NODE_ENV || "development",
	frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};

export const corsOptions = {
	origin: [secrets.frontendUrl], // allow your React app
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true, // allow cookies/auth headers
};
