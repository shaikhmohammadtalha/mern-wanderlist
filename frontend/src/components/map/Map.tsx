import { useState } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMapEvents,
	ZoomControl,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import { useCreateDestination } from "@/hooks/useDestinations";

// Fix default Leaflet icon (otherwise broken in React)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapProps {
	destinations: Destination[];
}

interface Destination {
	id: string;
	name: string;
	coordinates: { lat: number; lng: number };
	notes?: string;
	tags?: string[];
	visited: boolean;
	createdAt: string;
	editedAt?: string;
}

export default function Map({ destinations }: MapProps) {
	const [selectedPos, setSelectedPos] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [newName, setNewName] = useState("");

	const { mutate: createDestination } = useCreateDestination();

	// Fetch destinations on mount
	const handleSave = () => {
		if (!selectedPos || !newName) return;

		createDestination(
			{ name: newName, coordinates: selectedPos },
			{
				onSuccess: () => {
					setSelectedPos(null);
					setNewName("");
				},
			}
		);
	};

	// Handle map clicks to drop new pin
	function LocationMarker() {
		useMapEvents({
			click(e) {
				setSelectedPos(e.latlng);
			},
		});
		return null;
	}

	return (
		<div className="h-screen w-full">
			<MapContainer
				center={[20, 0]}
				zoom={2}
				className="h-full w-full"
				zoomControl={false}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OSM</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<ZoomControl position="bottomright" /> {/* or "topright" */}
				{/* Existing destinations */}
				{destinations.map((d) => (
					<Marker key={d.id} position={[d.coordinates.lat, d.coordinates.lng]}>
						<Popup>
							<strong>{d.name}</strong>
							<br />
							{d.notes || "No notes"}
							<br />
							<em>{d.visited ? "Visited" : "Planned"}</em>
						</Popup>
					</Marker>
				))}
				{/* New marker preview */}
				{selectedPos && (
					<Marker position={[selectedPos.lat, selectedPos.lng]}>
						<Popup>
							<input
								type="text"
								placeholder="Destination name"
								value={newName}
								onChange={(e) => setNewName(e.target.value)}
								className="border p-1 rounded w-full mb-2"
							/>
							<button
								onClick={handleSave}
								className="bg-blue-500 text-white px-2 py-1 rounded"
							>
								Save
							</button>
						</Popup>
					</Marker>
				)}
				<LocationMarker />
			</MapContainer>
		</div>
	);
}
