import mongoose, { Schema, Document } from "mongoose";
import { CATEGORIES, Category } from "../constants/categories";

export interface IDestination extends Document {
	userId: mongoose.Types.ObjectId;
	name: string;
	coordinates: { lat: number; lng: number };
	notes?: string;
	tags?: string[];
	category: Category;
	visited: boolean;
	createdAt: Date;
	editedAt?: Date;
}

const DestinationSchema = new Schema<IDestination>({
	userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	name: { type: String, required: true },
	coordinates: {
		lat: { type: Number, required: true },
		lng: { type: Number, required: true },
	},
	notes: { type: String },
	tags: [{ type: String }],
	category: {
		type: String,
		enum: CATEGORIES,
		required: true,
		default: "None",
	},
	visited: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
	editedAt: { type: Date },
});

export default mongoose.model<IDestination>("Destination", DestinationSchema);
