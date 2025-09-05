import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { loginSchema, signupSchema } from "../utils/zod.schema";

export const signup = async (req: Request, res: Response) => {
	try {
		const parseResult = signupSchema.safeParse(req.body);
		if (!parseResult.success) {
			return res.status(400).json({
				message: "Invalid input",
				errors: parseResult.error.issues,
			});
		}
		const { firstName, lastName, email, password } = parseResult.data;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		// Save new user
		const user = new User({ firstName, lastName, email, passwordHash });
		await user.save();

		// Create token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
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
	} catch (err: any) {
		console.error("Signup error:", err.message || err);
		res.status(500).json({ message: "Signup failed", error: err.message });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const parseResult = loginSchema.safeParse(req.body);
		if (!parseResult.success) {
			return res.status(400).json({
				message: "Invalid input",
				errors: parseResult.error.issues,
			});
		}
		const { email, password } = parseResult.data;

		// Find User
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Compare password
		const isMatch = await bcrypt.compare(password, user.passwordHash);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Create token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
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
	} catch (err) {
		res.status(500).json({ message: "Login failed", error: err });
	}
};
