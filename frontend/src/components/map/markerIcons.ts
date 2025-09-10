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

export const categoryTailwind: Record<Category, string> = {
	None: 
		"bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700",
	Adventure:
		"bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200 border-red-300 dark:border-red-700",
	Food: 
		"bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-700",
	Relaxation:
		"bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700",
	Cultural:
		"bg-violet-200 text-violet-800 dark:bg-violet-800 dark:text-violet-200 border-violet-300 dark:border-violet-700",
	Nature:
		"bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 border-green-300 dark:border-green-700",
};
