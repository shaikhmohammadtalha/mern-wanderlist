import { Request, Response } from "express";
import Destination from "../models/Destination";
import { AuthRequest } from "../middleware/auth";
import {
	destinationSchema,
	objectIdSchema,
	updateDestinationSchema,
} from "../utils/zod.schema";

export const addDestination = async (req: AuthRequest, res: Response) => {
	try {
		const parseResult = destinationSchema.safeParse(req.body);
		if (!parseResult.success) {
			return res.status(400).json({
				message: "Invalid input",
				errors: parseResult.error.issues,
			});
		}
		const { name, coordinates, notes, tags, visited } = parseResult.data;

		if (!req.user?.id) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Check if destination with same name exists for this user
		const existingDestination = await Destination.findOne({
			name,
			userId: req.user.id,
		});
		if (existingDestination) {
			return res
				.status(400)
				.json({ message: "Destination already exists for this user" });
		}

		// Save new Destination
		const destination = new Destination({
			userId: req.user.id,
			name,
			coordinates,
			notes,
			tags,
		});

		await destination.save();

		res.status(201).json({
			destination: {
				id: destination._id,
				name: destination.name,
				coordinates: destination.coordinates,
				notes: destination.notes,
				tags: destination.tags,
				visited: destination.visited,
				createdAt: destination.createdAt,
			},
		});
	} catch (err: any) {
		console.error("Adding Destination error:", err.message || err);
		res
			.status(500)
			.json({ message: "Adding Destination failed", error: err.message });
	}
};

export const getDestinations = async (req: AuthRequest, res: Response) => {
	try {
		// Check auth
		if (!req.user?.id) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Find all destinations for the logged-in user
		const destinations = await Destination.find({ userId: req.user.id });

		console.log("Destinations found for user", req.user.id, destinations);

		res.status(200).json({
			destinations: destinations.map((d) => ({
				id: d._id,
				name: d.name,
				coordinates: d.coordinates,
				notes: d.notes,
				tags: d.tags,
				visited: d.visited,
				createdAt: d.createdAt,
			})),
		});
	} catch (err: any) {
		console.error("Getting Destinations error:", err.message || err);
		res.status(500).json({
			message: "Getting Destinations failed",
			error: err.message,
		});
	}
};

export const updateDestination = async (req: AuthRequest, res: Response) => {
	try {
		// Validate ID
		const idValidation = objectIdSchema.safeParse(req.params.id);
		if (!idValidation.success) {
			return res.status(400).json({
				message: "Invalid destination ID",
				errors: idValidation.error.issues,
			});
		}
		const destinationId = idValidation.data;

		// Check auth
		if (!req.user?.id) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// Validate body
		const parseResult = updateDestinationSchema.safeParse(req.body);
		if (!parseResult.success) {
			return res.status(400).json({
				message: "Invalid input",
				errors: parseResult.error.issues,
			});
		}
		const { notes, tags, visited } = parseResult.data;

		// Find destination owned by user
		const destination = await Destination.findOne({
			_id: destinationId,
			userId: req.user.id,
		});
		if (!destination) {
			return res.status(404).json({ message: "Destination not found" });
		}

		// Apply updates only if provided
		if (notes !== undefined) destination.notes = notes;
		if (tags !== undefined) destination.tags = tags;
		if (visited !== undefined) destination.visited = visited;

		await destination.save();

		// Send response
		res.status(200).json({
			destination: {
				id: destination._id,
				name: destination.name,
				coordinates: destination.coordinates,
				notes: destination.notes,
				tags: destination.tags,
				visited: destination.visited,
				createdAt: destination.createdAt,
			},
		});
	} catch (err: any) {
		console.error("Updating Destination error:", err.message || err);
		res.status(500).json({
			message: "Updating Destination failed",
			error: err.message,
		});
	}
};

export const deleteDestination = async (req: AuthRequest, res: Response) => {
	try {
		// Validate ID
		const idValidation = objectIdSchema.safeParse(req.params.id);
		if (!idValidation.success) {
			return res.status(400).json({
				message: "Invalid destination ID",
				errors: idValidation.error.issues,
			});
		}
		const destinationId = idValidation.data;
		// Check auth
		if (!req.user?.id) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		const destination = await Destination.findOneAndDelete({
			_id: destinationId,
			userId: req.user.id,
		});
		if (!destination) {
			return res.status(404).json({ message: "Destination not found" });
		}
		res.status(200).json({ message: "Destination deleted successfully" });
	} catch (err: any) {
		console.error("Deleting Destination error:", err.message || err);
		res.status(500).json({
			message: "Deleting Destination failed",
			error: err.message,
		});
	}
};
