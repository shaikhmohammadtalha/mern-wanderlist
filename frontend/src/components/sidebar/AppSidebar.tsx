import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import AppSidebarContent from "./AppSidebarContent";
import AppSidebarFooter from "./AppSidebarFooter";
import type { Destination } from "@/types/destination";

interface AppSidebarProps {
	destinations: Destination[];
	onDelete?: (id: string) => void;
	onEdit?: (id: string, updates: Partial<Destination>) => void;
	onFocus?: (id: string) => void;
}

export default function AppSidebar({
	destinations,
	onDelete,
	onEdit,
	onFocus,
}: AppSidebarProps) {
	return (
		<Sidebar>
			<SidebarContent className="flex flex-col h-full">
				<AppSidebarContent
					destinations={destinations}
					onDelete={onDelete}
					onEdit={onEdit}
					onFocus={onFocus}
				/>

				<AppSidebarFooter />
			</SidebarContent>
		</Sidebar>
	);
}
