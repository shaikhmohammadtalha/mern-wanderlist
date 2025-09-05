import { Edit, Trash } from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "../ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import type { Destination } from "@/types/destination";
import { formatDistanceToNow, format } from "date-fns";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface DestinationCardProps {
	id: string;
	name: string;
	notes?: string;
	tags?: string[];
	visited: boolean;
	createdAt: string;
	editedAt?: string;
	onDelete?: (id: string) => void;
	onEdit?: (id: string, updates: Partial<Destination>) => void;
}

export default function DestinationCard({
	id,
	name,
	notes,
	tags,
	visited,
	createdAt,
	editedAt,
	onDelete,
	onEdit,
}: DestinationCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editName, setEditName] = useState(name);
	const [editNotes, setEditNotes] = useState(notes || "");
	const [editTags, setEditTags] = useState(tags?.join(", ") || "");
	const [editVisited, setEditVisited] = useState(visited);
	const isMobile = useMediaQuery("(max-width: 640px)");

	return (
		<Card className="mb-4 shadow hover:shadow-lg transition-all">
			<CardHeader>
				<CardTitle className="flex justify-between items-center truncate">
					<span>{name}</span>
					<Badge variant={visited ? "default" : "outline"}>
						{visited ? "Visited" : "Planned"}
					</Badge>
				</CardTitle>
			</CardHeader>

			<CardContent>
				{isEditing ? (
					<div className="space-y-2">
						<input
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
							className="border p-1 rounded w-full"
						/>
						<textarea
							value={editNotes}
							onChange={(e) => setEditNotes(e.target.value)}
							className="border p-1 rounded w-full"
						/>
						<input
							value={editTags}
							onChange={(e) => setEditTags(e.target.value)}
							placeholder="Comma separated tags"
							className="border p-1 rounded w-full"
						/>
						<select
							value={editVisited ? "visited" : "planned"}
							onChange={(e) => setEditVisited(e.target.value === "visited")}
							className="border p-1 rounded w-full"
						>
							<option value="planned">Planned</option>
							<option value="visited">Visited</option>
						</select>
					</div>
				) : (
					<>
						<p className="text-sm text-muted-foreground mb-2">
							{notes || "No notes provided."}
						</p>
						{tags && tags.length > 0 && (
							<div className="flex flex-wrap gap-1 space-x-1  mb-2">
								{tags.map((tag) => (
									<Badge key={tag} variant="secondary">
										{tag}
									</Badge>
								))}
							</div>
						)}
						<small className="text-muted-foreground">
							{isMobile ? (
								// mobile → show both relative + absolute inline
								<>
									{editedAt ? "Edited " : "Created "}
									{formatDistanceToNow(new Date(editedAt ?? createdAt), {
										addSuffix: true,
									})}{" "}
									<span className="text-muted-foreground/70">({" "}
									
										{format(
											new Date(editedAt ?? createdAt),
											"MMM d yyyy, h:mm a"
										)}
									{" "}
									)</span>
								</>
							) : (
								// desktop → hover over the whole text
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<span className="cursor-help">
												{editedAt ? "Edited " : "Created "}
												{formatDistanceToNow(new Date(editedAt ?? createdAt), {
													addSuffix: true,
												})}
											</span>
										</TooltipTrigger>
										<TooltipContent side="right">
											{format(
												new Date(editedAt ?? createdAt),
												"MMM d yyyy, h:mm a"
											)}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</small>
					</>
				)}
			</CardContent>

			<CardFooter className="flex justify-between items-center">
				{isEditing ? (
					<>
						<Button
							size="sm"
							onClick={() => {
								onEdit?.(id, {
									name: editName,
									notes: editNotes,
									tags: editTags.split(",").map((t) => t.trim()),
									visited: editVisited,
								});

								setIsEditing(false);
							}}
						>
							Save
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => setIsEditing(false)}
						>
							Cancel
						</Button>
					</>
				) : (
					<>
						{onEdit && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsEditing(true)}
							>
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
					</>
				)}
			</CardFooter>
		</Card>
	);
}
