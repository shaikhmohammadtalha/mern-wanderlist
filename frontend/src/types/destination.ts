import { type Category } from "@/types/categories";

export interface Destination {
	id: string;
	name: string;
	coordinates: { lat: number; lng: number };
	notes?: string;
	tags?: string[];
	category: Category;
	visited: boolean;
	createdAt: string;
	editedAt?: string;
}
