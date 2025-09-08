import { Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { MapPin, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { categoryIcons } from "./markerIcons";
import type { Destination } from "@/types/destination";

export default function DestinationMarker({
	destination,
	onDelete,
	onFocus,
}: {
	destination: Destination;
	onDelete?: (id: string) => void;
	onFocus?: (id: string) => void;
}) {
	return (
		<Marker
			position={[destination.coordinates.lat, destination.coordinates.lng]}
			icon={categoryIcons[destination.category]}
		>
			<Popup>
				<div className="space-y-1 text-sm">
					<strong className="text-base">{destination.name}</strong>
					<div>{destination.notes || "No notes"}</div>
					{destination.tags && destination.tags.length > 0 && (
						<div>
							Tags:{" "}
							<span className="italic">{destination.tags.join(", ")}</span>
						</div>
					)}
					<div>Category: {destination.category}</div>
					<div>Status: {destination.visited ? "📍Visited" : "📌 Planned"}</div>

					<div className="flex justify-between gap-1 mt-2">
						{onFocus && (
							<Button
								variant="secondary"
								size="sm"
								className="mt-1 mb-1"
								onClick={() => onFocus(destination.id)}
							>
								<MapPin className="w-4 h-4 mr-1" /> Location
							</Button>
						)}

						{onDelete && (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="destructive" size="sm" className="mt-1 mb-1">
										<Trash className="w-4 h-4 mr-1" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Delete destination?</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. The destination{" "}
											<span className="font-semibold">{destination.name}</span>{" "}
											will be removed permanently.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => onDelete(destination.id)}
											className="bg-destructive text-white hover:bg-destructive/90"
										>
											Confirm
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						)}
					</div>
				</div>
			</Popup>
		</Marker>
	);
}
