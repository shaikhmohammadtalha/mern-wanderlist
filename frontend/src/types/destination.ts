export interface Destination {
	id: string;
	name: string;
	coordinates: { lat: number; lng: number };
	notes?: string;
	tags?: string[];
	visited: boolean;
	createdAt: string;
	editedAt?: string;
}
