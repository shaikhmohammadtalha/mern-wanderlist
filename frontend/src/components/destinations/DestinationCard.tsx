import { Edit, Trash, MapPin } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
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
import type { Category } from "@/types/categories";
import { formatDistanceToNow, format } from "date-fns";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

interface DestinationCardProps {
	id: string;
	name: string;
	notes?: string;
	tags?: string[];
	category: Category;
	visited: boolean;
	createdAt: string;
	editedAt?: string;
	onDelete?: (id: string) => void;
	onEdit?: (id: string, updates: Partial<Destination>) => void;
	onFocus?: (id: string) => void;
}

export default function DestinationCard({
	id,
	name,
	notes,
	tags,
	category,
	visited,
	createdAt,
	editedAt,
	onDelete,
	onEdit,
	onFocus,
}: DestinationCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editName, setEditName] = useState(name);
	const [editNotes, setEditNotes] = useState(notes || "");
	const [editTagsList, setEditTagsList] = useState(tags || []);
	const [editCategory, setEditCategory] = useState<Category>(category);
	const [tagInput, setTagInput] = useState("");
	const [editVisited, setEditVisited] = useState(visited);
	const isMobile = useMediaQuery("(max-width: 640px)");

	return (
		// Change Card width dirrectly from ui/sidebar.tsx const SIDEBAR_WIDTH =
		<Card className="my-1 mx-2 shadow hover:shadow-lg transition-all">
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
					<div className="space-y-3">
						<div className="grid gap-2">
							<Label htmlFor="name">Destination Name</Label>
							<Input
								id="name"
								value={editName}
								onChange={(e) => setEditName(e.target.value)}
								placeholder="Destination name"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="notes">Notes</Label>
							<Textarea
								id="notes"
								value={editNotes}
								onChange={(e) => setEditNotes(e.target.value)}
								placeholder="Notes"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="dest-tags">Tags</Label>
							<div className="flex flex-wrap gap-2 border rounded p-2">
								{editTagsList.map((tag, i) => (
									<Badge
										key={i}
										variant="secondary"
										className="flex items-center gap-1"
									>
										{tag}
										<button
											type="button"
											onClick={() =>
												setEditTagsList(
													editTagsList.filter((_, idx) => idx !== i)
												)
											}
											className="ml-1 text-xs text-muted-foreground hover:text-foreground"
										>
											×
										</button>
									</Badge>
								))}
								<Input
									id="dest-tags"
									value={tagInput}
									onChange={(e) => setTagInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === ",") {
											e.preventDefault();
											if (tagInput.trim()) {
												setEditTagsList([...editTagsList, tagInput.trim()]);
												setTagInput("");
											}
										}
									}}
									className="min-w-[100px] flex-shrink border-none focus-visible:ring-0 shadow-none p-0 truncate"
									placeholder="Comma-separated tags (e.g., beach, food)"
								/>
								<Button
									type="button"
									size="sm"
									variant="outline"
									onClick={() => {
										if (tagInput.trim()) {
											setEditTagsList([...editTagsList, tagInput.trim()]);
											setTagInput("");
										}
									}}
								>
									+
								</Button>
							</div>
						</div>

						<div className="grid gap-2">
							<Label>Category</Label>
							<Select
								value={editCategory}
								onValueChange={(val) => setEditCategory(val as Category)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Choose category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="None">None</SelectItem>
									<SelectItem value="Adventure">Adventure</SelectItem>
									<SelectItem value="Food">Food</SelectItem>
									<SelectItem value="Relaxation">Relaxation</SelectItem>
									<SelectItem value="Cultural">Cultural</SelectItem>
									<SelectItem value="Nature">Nature</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-2">
							<Label>Status</Label>
							<Select
								value={editVisited ? "visited" : "planned"}
								onValueChange={(value) => setEditVisited(value === "visited")}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="planned">Planned</SelectItem>
									<SelectItem value="visited">Visited</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				) : (
					<div className="space-y-3">
						<CardDescription>{notes || "No notes provided."}</CardDescription>
						<div className="text-sm">
							Category:{" "}
							<Badge variant="outline" className="ml-1">
								{category}
							</Badge>
						</div>
						{tags && tags.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{tags.map((tag) => (
									<Badge key={tag} variant="secondary">
										{tag}
									</Badge>
								))}
							</div>
						)}

						{onFocus && (
							<Button
								variant="secondary"
								size="sm"
								className="mt-1 mb-1"
								onClick={() => onFocus(id)}
							>
								<MapPin className="w-4 h-4 mr-1" /> Location
							</Button>
						)}

						<div className="text-xs text-muted-foreground">
							{isMobile ? (
								<>
									{editedAt ? "Edited " : "Created "}
									{formatDistanceToNow(new Date(editedAt ?? createdAt), {
										addSuffix: true,
									})}{" "}
									<span className="text-muted-foreground/70">
										(
										{format(
											new Date(editedAt ?? createdAt),
											"MMM d yyyy, h:mm a"
										)}
										)
									</span>
								</>
							) : (
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
										<TooltipContent side="bottom">
											{format(
												new Date(editedAt ?? createdAt),
												"MMM d yyyy, h:mm a"
											)}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</div>
					</div>
				)}
			</CardContent>

			<CardFooter className="flex gap-2 justify-end">
				{isEditing ? (
					<>
						<Button
							size="sm"
							onClick={() => {
								onEdit?.(id, {
									name: editName,
									notes: editNotes,
									tags: editTagsList,
									category: editCategory,
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
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="destructive" size="sm">
										<Trash className="w-4 h-4 mr-1" /> Delete
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Delete destination?</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. The destination{" "}
											<span className="font-semibold">{name}</span> will be
											removed permanently.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => onDelete(id)}
											className="bg-destructive text-white hover:bg-destructive/90"
										>
											Confirm
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						)}
					</>
				)}
			</CardFooter>
		</Card>
	);
}
