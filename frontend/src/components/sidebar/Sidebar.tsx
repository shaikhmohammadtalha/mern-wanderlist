import DestinationCard from "../destinations/DestinationCard";
import type { Destination } from "@/types/destination";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
	destinations: Destination[];
	onDelete?: (id: string) => void;
	onEdit?: (id: string, updates: Partial<Destination>) => void;
}

export default function Sidebar({
	isOpen,
	onClose,
	destinations,
	onDelete,
	onEdit,
}: SidebarProps) {
	return (
		<div
			className={`fixed top-0 left-0 h-full w-sm bg-background shadow-lg z-40 transform transition-transform duration-300 rounded-r-2xl
  ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
		>
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b">
				<h2 className="text-lg font-bold">Destinations</h2>
				<button
					onClick={onClose}
					className="text-gray-600 hover:text-black rounded-sm border px-1.5"
				>
					✕
				</button>
			</div>

			{/* Sidebar Content */}
			<div className="p-4">
				{destinations.map((d) => (
					<DestinationCard
						key={d.id}
						{...d}
						onDelete={onDelete}
						onEdit={onEdit}
					/>
				))}
			</div>
		</div>
	);
}
