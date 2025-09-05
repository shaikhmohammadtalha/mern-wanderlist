import { Edit, Trash } from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";

interface DestinationCardProps {
	id: string;
	name: string;
	notes?: string;
	tags?: string[];
	visited: boolean;
	createdAt: string;
	onDelete?: (id: string) => void;
	onEdit?: (id: string) => void;
}

export default function DestinationCard({
	id,
	name,
	notes,
	tags,
	visited,
	createdAt,
	onDelete,
	onEdit,
}: DestinationCardProps) {
	return (
		<Card className="mb-4 shadow hover:shadow-lg transition-all">
			<CardHeader>
				<CardTitle className="flex justify-between items-center">
					<span>{name}</span>
					<Badge variant={visited ? "success" : "outline"}>
						{visited ? "Visited" : "Planned"}
					</Badge>
				</CardTitle>
			</CardHeader>

			<CardContent>
				<p className="text-sm text-muted-foreground mb-2">
					{notes || "No notes provided."}
				</p>
				{tags && tags.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{tags.map((tag) => (
							<Badge key={tag} variant="secondary">
								{tag}
							</Badge>
						))}
					</div>
				)}
			</CardContent>

			<CardFooter className="flex justify-between items-center">
				<small className="text-muted-foreground">
					{new Date(createdAt).toLocaleDateString()}
				</small>
				<div className="flex gap-2">
					{onEdit && (
						<Button variant="outline" size="sm" onClick={() => onEdit(id)}>
							<Edit className="w-4 h-4 mr-1" /> Edit
						</Button>
					)}
					{onDelete && (
						<Button
							variant="destructive"
							size="sm"
							onClick={() => onDelete(id)}
						>
							<Trash className="w-4 h-4 mr-1" /> Delete
						</Button>
					)}
				</div>
			</CardFooter>
		</Card>
	);
}
