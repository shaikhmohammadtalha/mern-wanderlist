import { Response } from "express";
import Destination from "../models/Destination";
import { AuthRequest } from "../middleware/auth";
import {
	destinationSchema,
	objectIdSchema,
	updateDestinationSchema,
} from "../utils/zod.schema";

export const addDestination = async (
	req: AuthRequest,
	res: Response
): Promise<void> => {
	try {
		const parseResult = destinationSchema.safeParse(req.body);
		if (!parseResult.success) {
			res.status(400).json({
				message: "Invalid input",
				errors: parseResult.error.issues,
			});
			return;
		}
		const { name, coordinates, notes, tags, category, visited } =
			parseResult.data;

		if (!req.user?.id) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		// Check if destination with same name exists for this user
		const existingDestination = await Destination.findOne({
			name,
			userId: req.user.id,
		});
		if (existingDestination) {
			res
				.status(400)
				.json({ message: "Destination already exists for this user" });
			return;
		}

		// Save new Destination
		const destination = new Destination({
			userId: req.user.id,
			name,
			coordinates,
			notes,
			tags,
			category: category ?? "None",
			visited: visited ?? false,
		});

		await destination.save();

		res.status(201).json({
			destination: {
				id: destination._id,
				name: destination.name,
				coordinates: destination.coordinates,
				notes: destination.notes,
				tags: destination.tags,
				category: destination.category ?? "None",
				visited: destination.visited,
				createdAt: destination.createdAt,
				editedAt: destination.editedAt,
			},
		});
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error("Adding Destination error:", message);
		res.status(500).json({ message: "Adding Destination failed", error: message });
	}
};

export const getDestinations = async (
	req: AuthRequest,
	res: Response
): Promise<void> => {
	try {
		// Check auth
		if (!req.user?.id) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		// Find all destinations for the logged-in user
		const destinations = await Destination.find({ userId: req.user.id });

		res.status(200).json({
			destinations: destinations.map((d) => ({
				id: d._id,
				name: d.name,
				coordinates: d.coordinates,
				notes: d.notes,
				tags: d.tags,
				category: d.category,
				visited: d.visited,
				createdAt: d.createdAt,
				editedAt: d.editedAt,
			})),
		});
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error("Getting Destinations error:", message);
		res.status(500).json({
			message: "Getting Destinations failed",
			error: message,
		});
	}
};

export const updateDestination = async (
	req: AuthRequest,
	res: Response
): Promise<void> => {
	try {
		// Validate ID
		const idValidation = objectIdSchema.safeParse(req.params.id);
		if (!idValidation.success) {
			res.status(400).json({
				message: "Invalid destination ID",
				errors: idValidation.error.issues,
			});
			return;
		}
		const destinationId = idValidation.data;

		// Check auth
		if (!req.user?.id) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		// Validate body
		const parseResult = updateDestinationSchema.safeParse(req.body);
		if (!parseResult.success) {
			res.status(400).json({
				message: "Invalid input",
				errors: parseResult.error.issues,
			});
			return;
		}
		const { notes, tags, category, visited } = parseResult.data;

		// Find destination owned by user
		const destination = await Destination.findOne({
			_id: destinationId,
			userId: req.user.id,
		});
		if (!destination) {
			res.status(404).json({ message: "Destination not found" });
			return;
		}

		// Apply updates only if provided
		if (notes !== undefined) destination.notes = notes;
		if (tags !== undefined) destination.tags = tags;
		if (category !== undefined) {
			destination.category = category ?? "None";
		}
		if (visited !== undefined) destination.visited = visited;
		destination.editedAt = new Date();

		await destination.save();

		// Send response
		res.status(200).json({
			destination: {
				id: destination._id,
				name: destination.name,
				coordinates: destination.coordinates,
				notes: destination.notes,
				tags: destination.tags,
				category: destination.category,
				visited: destination.visited,
				createdAt: destination.createdAt,
				editedAt: destination.editedAt,
			},
		});
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error("Updating Destination error:", message);
		res.status(500).json({
			message: "Updating Destination failed",
			error: message,
		});
	}
};

export const deleteDestination = async (
	req: AuthRequest,
	res: Response
): Promise<void> => {
	try {
		// Validate ID
		const idValidation = objectIdSchema.safeParse(req.params.id);
		if (!idValidation.success) {
			res.status(400).json({
				message: "Invalid destination ID",
				errors: idValidation.error.issues,
			});
			return;
		}
		const destinationId = idValidation.data;

		// Check auth
		if (!req.user?.id) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		const destination = await Destination.findOneAndDelete({
			_id: destinationId,
			userId: req.user.id,
		});
		if (!destination) {
			res.status(404).json({ message: "Destination not found" });
			return;
		}

		res.status(200).json({ message: "Destination deleted successfully" });
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error("Deleting Destination error:", message);
		res.status(500).json({
			message: "Deleting Destination failed",
			error: message,
		});
	}
};
