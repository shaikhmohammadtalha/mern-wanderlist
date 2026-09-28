import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import AppSidebarContent from "./AppSidebarContent";
import AppSidebarFooter from "./AppSidebarFooter";
import type { Destination } from "@/types/destination";
import { MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";
import type { CSSProperties } from "react";

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
		<Sidebar
			collapsible="offcanvas"
			className="border-r border-border"
			style={
				{
					"--sidebar-width": "22rem",
					"--sidebar-width-mobile": "min(22rem, 85vw)",
				} as CSSProperties
			}
		>
			<SidebarHeader className="border-b border-border p-3">
				<NavLink
					to="/"
					className="flex items-center gap-3 px-2 transition-colors hover:text-primary"
				>
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-medium text-primary-foreground">
						<MapPin className="h-4 w-4" />
					</div>
					<h2 className="text-sm font-semibold">WanderList</h2>
				</NavLink>

				<nav className="mt-2 flex flex-col gap-1" aria-label="Navigation">
					<NavLink
						to="/"
						className={({ isActive }) =>
							`rounded-md px-2 py-1.5 text-sm transition-colors ${
								isActive
									? "bg-primary/10 font-medium text-primary"
									: "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
							}`
						}
					>
						Map
					</NavLink>
					<NavLink
						to="/destinations"
						className={({ isActive }) =>
							`rounded-md px-2 py-1.5 text-sm transition-colors ${
								isActive
									? "bg-primary/10 font-medium text-primary"
									: "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
							}`
						}
					>
						All Destinations
					</NavLink>
					<NavLink
						to="/stats"
						className={({ isActive }) =>
							`rounded-md px-2 py-1.5 text-sm transition-colors ${
								isActive
									? "bg-primary/10 font-medium text-primary"
									: "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
							}`
						}
					>
						Stats
					</NavLink>
				</nav>
			</SidebarHeader>

			<SidebarContent className="min-w-0">
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
