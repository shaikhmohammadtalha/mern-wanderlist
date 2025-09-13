import { useEffect, useState } from "react";
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useCreateDestination } from "@/hooks/useDestinations";

interface AddDestinationPopupProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mapCoordinates?: { lat: number; lng: number } | null;
	manualMode: boolean;
	manualLocation?: { lat: number; lng: number } | null;
	onSetManualMode: (v: boolean) => void;
	onSetManualLocation: (loc: { lat: number; lng: number } | null) => void;

	// ✅ Make sure this exists
	onSave: (data: {
		name: string;
		notes?: string;
		tags?: string[];
		category: Category;
		visited: boolean;
		coordinates: { lat: number; lng: number };
	}) => void;
}

export default function AddDestinationPopup({
	open,
	onOpenChange,
	mapCoordinates,
	manualMode,
	manualLocation,
	onSetManualLocation,
}: AddDestinationPopupProps) {
	const [name, setName] = useState("");
	const [notes, setNotes] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");
	const [category, setCategory] = useState<Category>("None");
	const [visited, setVisited] = useState(false);
	const [lat, setLat] = useState<number | "">("");
	const [lng, setLng] = useState<number | "">("");
	const [editingCoords, setEditingCoords] = useState(false);
	const [error, setError] = useState("");

	const createDestination = useCreateDestination();

	// Sync coordinates on prop change or mode change
	useEffect(() => {
		if (manualMode) {
			setLat(manualLocation?.lat ?? "");
			setLng(manualLocation?.lng ?? "");
		} else {
			setLat(mapCoordinates?.lat ?? manualLocation?.lat ?? "");
			setLng(mapCoordinates?.lng ?? manualLocation?.lng ?? "");
		}
	}, [manualMode, mapCoordinates, manualLocation]);

	const handleSave = () => {
		setError("");
		if (!name.trim()) {
			setError("Please enter a destination name.");
			return;
		}

		let finalLat: number | null = lat !== "" ? Number(lat) : null;
		let finalLng: number | null = lng !== "" ? Number(lng) : null;

		if (finalLat === null || finalLng === null) {
			if (manualMode && manualLocation) {
				finalLat = manualLocation.lat;
				finalLng = manualLocation.lng;
			} else if (mapCoordinates) {
				finalLat = mapCoordinates.lat;
				finalLng = mapCoordinates.lng;
			} else {
				setError("Please provide valid coordinates.");
				return; // no coordinates
			}
		}

		const coordinates = { lat: finalLat, lng: finalLng };

		if (manualMode) onSetManualLocation(coordinates);

		createDestination.mutate(
			{ name, notes, tags, category, visited, coordinates },
			{
				onSuccess: () => {
					// Reset all UI
					setName("");
					setNotes("");
					setTags([]);
					setTagInput("");
					setVisited(false);
					setLat("");
					setLng("");
					setEditingCoords(false);
					onOpenChange(false);
				},
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Add Destination</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-2">
					{/* Name */}
					<div className="grid gap-2">
						<Label htmlFor="dest-name">Name</Label>
						<Input
							id="dest-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. Paris"
						/>
					</div>

					{/* Coordinates */}
					<div className="grid gap-2">
						<Label>Coordinates</Label>
						<div className="flex gap-2">
							<Input
								type="number"
								value={lat}
								onChange={(e) =>
									setLat(e.target.value === "" ? "" : Number(e.target.value))
								}
								placeholder="Latitude"
								disabled={!manualMode && !editingCoords}
							/>
							<Input
								type="number"
								value={lng}
								onChange={(e) =>
									setLng(e.target.value === "" ? "" : Number(e.target.value))
								}
								placeholder="Longitude"
								disabled={!manualMode && !editingCoords}
							/>
						</div>

						{!manualMode && (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										type="button"
										variant="outline"
										size="sm"
										className="mt-1 w-fit"
									>
										{editingCoords ? "Lock Coordinates" : "Edit Coordinates"}
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											{editingCoords
												? "Lock Coordinates?"
												: "Edit Coordinates?"}
										</AlertDialogTitle>
										<AlertDialogDescription>
											{editingCoords
												? "This will prevent further manual editing of latitude and longitude."
												: "This will allow you to manually override map/search coordinates. Are you sure?"}
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => setEditingCoords((prev) => !prev)}
										>
											{editingCoords ? "Lock" : "Edit"}
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						)}
					</div>

					{/* Notes */}
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

					{/* Tags */}
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
									if (["Enter", " ", ","].includes(e.key)) {
										e.preventDefault();
										if (tagInput.trim()) {
											setTags([...tags, tagInput.trim()]);
											setTagInput("");
										}
									}
								}}
								className="min-w-[100px] flex-shrink border-none focus-visible:ring-0 shadow-none p-0 truncate"
								placeholder="Comma-separated tags"
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

					{/* Category */}
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

					{/* Status */}
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

				{error && <p className="text-red-500 text-sm">{error}</p>}

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
