import { z } from "zod";
import { CATEGORIES } from "../constants/categories";

export const signupSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const destinationSchema = z.object({
	name: z.string().min(1, "Destination name is required"),
	coordinates: z.object({
		lat: z.number(),
		lng: z.number(),
	}),
	notes: z.string().optional(),
	tags: z.array(z.string()).optional(),
	category: z.enum(CATEGORIES).nullable().optional().default("None"),
	visited: z.boolean().optional(),
});

export const updateDestinationSchema = destinationSchema.partial();

export const objectIdSchema = z
	.string()
	.refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
		message: "Invalid ObjectId",
	});
