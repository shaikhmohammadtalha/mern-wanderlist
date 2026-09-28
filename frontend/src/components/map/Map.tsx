import { useEffect } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	useMapEvents,
	ZoomControl,
	useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import DestinationMarker from "./DestinationMarker";
import type { Destination } from "@/types/destination";

// Fix default Leaflet icon (otherwise broken in React)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapProps {
	destinations: Destination[];
	activeDestinationId?: string | null;
	onDelete?: (id: string) => void;
	onFocus?: (id: string) => void;
	searchLocation?: { lat: number; lng: number } | null;
	selectedPos: { lat: number; lng: number } | null;
	setSelectedPos: (pos: { lat: number; lng: number } | null) => void;
	setManualMode: (val: boolean) => void;
	setPopupOpen: (val: boolean) => void;
}

function FlyToSearch({
	location,
}: {
	location?: { lat: number; lng: number } | null;
}) {
	const map = useMap();
	useEffect(() => {
		if (location) {
			map.flyTo([location.lat, location.lng], 13);
		}
	}, [location, map]);
	return null;
}

function FlyToDestination({ destination }: { destination?: Destination }) {
	const map = useMap();
	useEffect(() => {
		if (destination) {
			map.flyTo([destination.coordinates.lat, destination.coordinates.lng], 13);
		}
	}, [destination, map]);
	return null;
}

function LocationMarker({
	onLocationSelect,
}: {
	onLocationSelect: (position: { lat: number; lng: number }) => void;
}) {
	useMapEvents({
		click(event) {
			onLocationSelect(event.latlng);
		},
	});

	return null;
}

export default function Map({
	destinations,
	activeDestinationId,
	onDelete,
	onFocus,
	searchLocation,
	selectedPos,
	setSelectedPos,
	setManualMode,
	setPopupOpen,
}: MapProps) {
	return (
		<div className="h-full w-full">
			<MapContainer
				center={[20, 0]}
				zoom={2}
				className="h-full w-full"
				zoomControl={false}
				style={{ height: "100%", width: "100%" }}
			>
				<FlyToDestination
					destination={destinations.find((d) => d.id === activeDestinationId)}
				/>
				<FlyToSearch location={searchLocation} />
				{searchLocation && (
					<Marker
						position={[searchLocation.lat, searchLocation.lng]}
						eventHandlers={{
							click: () => setPopupOpen(true),
						}}
					/>
				)}
				{/* New marker preview */}
				{selectedPos && (
					<Marker
						position={[selectedPos.lat, selectedPos.lng]}
						eventHandlers={{
							click: () => setPopupOpen(true),
						}}
					/>
				)}
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OSM</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<ZoomControl position="bottomright" />
				{/* Existing destinations */}
				{destinations.map((dest) => (
					<DestinationMarker
						key={dest.id}
						destination={dest}
						onDelete={onDelete}
						onFocus={onFocus}
					/>
				))}
				<LocationMarker
					onLocationSelect={(position) => {
						setSelectedPos(position);
						setManualMode(false);
					}}
				/>
			</MapContainer>
		</div>
	);
}
