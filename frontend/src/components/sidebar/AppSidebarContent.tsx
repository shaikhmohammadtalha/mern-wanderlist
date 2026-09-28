import DestinationCard from "../destinations/DestinationCard";
import type { Destination } from "@/types/destination";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Plus, ChevronDown } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
interface AppSidebarContentProps {
	destinations: Destination[];
	onDelete?: (id: string) => void;
	onEdit?: (id: string, updates: Partial<Destination>) => void;
	onFocus?: (id: string) => void;
	onAddDestination?: () => void;
}
export default function AppSidebarContent({
	destinations,
	onDelete,
	onEdit,
	onFocus,
	onAddDestination,
}: AppSidebarContentProps) {
	return (
		<div className="flex-1 overflow-y-auto max-h-screen">
			<Collapsible defaultOpen className="group/collapsible">
				<SidebarGroup>
					<SidebarGroupLabel asChild>
						<CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2">
							<span className="text-sm font-semibold">Destinations</span>
							<ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
						</CollapsibleTrigger>
					</SidebarGroupLabel>
					<CollapsibleContent>
						<SidebarGroupContent className="my-2 flex flex-col gap-2">
							{/* Add Destination button */}
							<button
								className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-primary hover:bg-primary/10 rounded-md mx-2"
								onClick={onAddDestination}
							>
								<Plus className="w-4 h-4" /> Add Destination
							</button>

							{destinations.map((d) => (
								<DestinationCard
									key={d.id}
									{...d}
									onDelete={onDelete}
									onEdit={onEdit}
									onFocus={() => onFocus?.(d.id)}
								/>
							))}
						</SidebarGroupContent>
					</CollapsibleContent>
				</SidebarGroup>
			</Collapsible>
		</div>
	);
}