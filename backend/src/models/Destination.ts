import mongoose, { Schema, Document } from "mongoose";

export interface IDestination extends Document {
	userId: mongoose.Types.ObjectId; // reference to User
	name: string;
	coordinates: { lat: number; lng: number };
	notes?: string;
	tags?: string[];
	visited: boolean;
	createdAt?: Date;
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
	visited: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IDestination>("Destination", DestinationSchema);
