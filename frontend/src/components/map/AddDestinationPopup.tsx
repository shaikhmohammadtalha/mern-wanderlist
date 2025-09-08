import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";
import type { Category } from "@/types/categories";

interface AddDestinationPopupProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (data: {
		name: string;
		notes?: string;
		tags?: string[];
		category: Category;
		visited: boolean;
	}) => void;
}

export default function AddDestinationPopup({
	open,
	onOpenChange,
	onSave,
}: AddDestinationPopupProps) {
	const [name, setName] = useState("");
	const [notes, setNotes] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");
	const [category, setCategory] = useState<Category>("None");
	const [visited, setVisited] = useState(false);

	const handleSave = () => {
		if (!name.trim()) return;
		onSave({
			name,
			notes,
			tags,
			category,
			visited,
		});
		// reset
		setName("");
		setNotes("");
		setTags([]);
		setTagInput("");
		setVisited(false);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Destination</DialogTitle>
					<DialogDescription>
						Fill in the details for your new destination.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-2">
					<div className="grid gap-2">
						<Label htmlFor="dest-name">Name</Label>
						<Input
							id="dest-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Paris"
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="dest-notes">Notes</Label>
						<textarea
							id="dest-notes"
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							className="border rounded p-2"
							placeholder="Your notes..."
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="dest-tags">Tags</Label>
						<div className="flex flex-wrap gap-2 border rounded p-2">
							{tags.map((tag, i) => (
								<Badge
									key={i}
									variant="secondary"
									className="flex items-center gap-1"
								>
									{tag}
									<button
										type="button"
										onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
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
									if (e.key === "Enter" || e.key === " " || e.key === ",") {
										e.preventDefault();
										if (tagInput.trim()) {
											setTags([...tags, tagInput.trim()]);
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
										setTags([...tags, tagInput.trim()]);
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
							value={category}
							onValueChange={(val: Category) => setCategory(val)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Choose category" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="None">None</SelectItem>
									<SelectItem value="Adventure">Adventure</SelectItem>
									<SelectItem value="Food">Food</SelectItem>
									<SelectItem value="Relaxation">Relaxation</SelectItem>
									<SelectItem value="Cultural">Cultural</SelectItem>
									<SelectItem value="Nature">Nature</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div className="grid gap-2">
						<Label>Status</Label>
						<Select
							value={visited ? "visited" : "planned"}
							onValueChange={(val) => setVisited(val === "visited")}
						>
							<SelectTrigger>
								<SelectValue placeholder="Choose status" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="planned">Planned</SelectItem>
									<SelectItem value="visited">Visited</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button onClick={handleSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
