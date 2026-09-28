import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import AppSidebarContent from "./AppSidebarContent";
import AppSidebarFooter from "./AppSidebarFooter";
import type { Destination } from "@/types/destination";
import { MapPin } from "lucide-react";

interface AppSidebarProps {
	destinations: Destination[];
	onDelete?: (id: string) => void;
	onEdit?: (id: string, updates: Partial<Destination>) => void;
	onFocus?: (id: string) => void;
	onAddDestination?: () => void;
}

export default function AppSidebar({
	destinations,
	onDelete,
	onEdit,
	onFocus,
	onAddDestination,
}: AppSidebarProps) {
	return (
		<Sidebar className="hidden lg:flex w-[22rem] border-r border-border">
			<SidebarHeader className="border-b border-border p-3">
				<div className="flex items-center gap-3 px-2">
					<div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-medium">
						<MapPin className="w-4 h-4" />
					</div>
					<h2 className="font-semibold text-sm">WanderList</h2>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<AppSidebarContent
					destinations={destinations}
					onDelete={onDelete}
					onEdit={onEdit}
					onFocus={onFocus}
					onAddDestination={onAddDestination}
				/>
				<AppSidebarFooter />
			</SidebarContent>
		</Sidebar>
	);
}