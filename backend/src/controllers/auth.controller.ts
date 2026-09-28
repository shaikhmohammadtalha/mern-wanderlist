import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Destination from "../models/Destination";
import { loginSchema, signupSchema } from "../utils/zod.schema";
import { secrets } from "../config";

const DEFAULT_DESTINATIONS = [
	{
		name: "Paris",
		coordinates: { lat: 48.8566, lng: 2.3522 },
		notes: "City of Light — art, food, and history.",
		tags: ["europe", "city-break"],
		category: "Cultural",
	},
	{
		name: "Tokyo",
		coordinates: { lat: 35.6762, lng: 139.6503 },
		notes: "A perfect mix of neon and tradition.",
		tags: ["asia", "foodie"],
		category: "Food",
	},
	{
		name: "New York City",
		coordinates: { lat: 40.7128, lng: -74.006 },
		notes: "The city that never sleeps.",
		tags: ["usa", "skyscrapers"],
		category: "Adventure",
	},
	{
		name: "Sydney",
		coordinates: { lat: -33.8688, lng: 151.2093 },
		notes: "Harbour, beaches, and sunshine.",
		tags: ["australia", "beach"],
		category: "Nature",
	},
];

export const signup = async (req: Request, res: Response): Promise<void> => {
	try {
		const parseResult = signupSchema.safeParse(req.body);
		if (!parseResult.success) {
			res.status(400).json({
				message: "Invalid input",
				errors: parseResult.error.issues,
			});
			return;
		}
		const { firstName, lastName, email, password } = parseResult.data;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			res.status(400).json({ message: "User already exists" });
			return;
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		// Save new user
		const user = new User({ firstName, lastName, email, passwordHash });
		await user.save();

		// Create sample destinations for new user
		const destinationDocs = DEFAULT_DESTINATIONS.map((dest) => ({
			userId: user._id,
			...dest,
			visited: false,
		}));
		await Destination.insertMany(destinationDocs);

		// Create token
		const token = jwt.sign({ id: user._id }, secrets.jwtSecret, {
			expiresIn: "7d",
		});

		res.status(201).json({
			token,
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
			},
		});
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error("Signup error:", message);
		res.status(500).json({ message: "Signup failed", error: message });
	}
};

export const login = async (req: Request, res: Response): Promise<void> => {
	try {
		const parseResult = loginSchema.safeParse(req.body);
		if (!parseResult.success) {
			res.status(400).json({
				message: "Invalid input",
				errors: parseResult.error.issues,
			});
			return;
		}
		const { email, password } = parseResult.data;

		// Find User
		const user = await User.findOne({ email });
		if (!user) {
			res.status(400).json({ message: "Invalid credentials" });
			return;
		}

		// Compare password
		const isMatch = await bcrypt.compare(password, user.passwordHash);
		if (!isMatch) {
			res.status(400).json({ message: "Invalid credentials" });
			return;
		}

		// Create token
		const token = jwt.sign({ id: user._id }, secrets.jwtSecret, {
			expiresIn: "7d",
		});

		res.json({
			token,
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
			},
		});
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error";
		res.status(500).json({ message: "Login failed", error: message });
	}
};
