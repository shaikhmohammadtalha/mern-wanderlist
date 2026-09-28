import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { loginSchema, signupSchema } from "../utils/zod.schema";
import { secrets } from "../config";

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
