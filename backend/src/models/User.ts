import mongoose, { Schema, Document } from "mongoose";

export interface IUSer extends Document {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
}

const UserSchema = new Schema<IUSer>({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	passwordHash: { type: String, required: true },
});

export default mongoose.model<IUSer>("User", UserSchema);