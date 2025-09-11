import mongoose from "mongoose";
import { secrets } from "./index";

const connectDB = async () => {
	try {
		if (!secrets.mongoUri) {
			console.error("❌ MONGO_URI is missing in .env");
			process.exit(1);
		}

		await mongoose.connect(secrets.mongoUri);
		console.log("✅ MongoDB connected");
	} catch (error: any) {
		console.error("❌ MongoDB connection failed:", error.message);
		process.exit(1);
	}
};

export default connectDB;
