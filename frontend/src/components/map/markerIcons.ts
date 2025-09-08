import L from "leaflet";
import type { Category } from "@/types/categories";

const baseMarker = (color: string) =>
	new L.Icon({
		iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
		shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
		iconSize: [25, 41],
		iconAnchor: [12, 41],
		popupAnchor: [1, -34],
		shadowSize: [41, 41],
	});

export const categoryIcons: Record<Category, L.Icon> = {
	None: baseMarker("grey"),
	Adventure: baseMarker("red"),
	Food: baseMarker("orange"),
	Relaxation: baseMarker("blue"),
	Cultural: baseMarker("violet"),
	Nature: baseMarker("green"),
};