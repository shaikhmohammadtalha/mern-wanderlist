import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import type { SearchResult } from "@/hooks/useDestinations";
import { SidebarTrigger } from "./ui/sidebar";
import SearchBar from "./searchbar/SearchBar";
import { NavLink } from "react-router-dom";
import { Plus, User2, MapPin } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

interface AppNavbarProps {
	onSearch: (query: string) => void;
	onDebounce: (query: string) => void;
	results: SearchResult[];
	loading: boolean;
	error: Error | null;
	onResultClick: (lat: string, lon: string) => void;
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
	onAddDestination?: () => void;
}

export default function AppNavbar({
	onSearch,
	onDebounce,
	results,
	loading,
	error,
	onResultClick,
	sidebarOpen,
	setSidebarOpen,
	onAddDestination,
}: AppNavbarProps) {
	const username = localStorage.getItem("username") || "User";
	const { setIsAuth } = useAuth();

	return (
		<header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm">
			<NavigationMenu className="w-full px-4 h-16">
				<NavigationMenuList className="w-full h-full flex items-center justify-between">
					{/* Left: Brand + Sidebar toggle */}
					<div className="flex items-center gap-2">
						<SidebarTrigger onClick={() => setSidebarOpen(!sidebarOpen)} />

						<NavLink
							to="/"
							className="flex items-center gap-2 hover:text-primary transition-colors"
						>
							<div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
								<MapPin className="w-4 h-4" />
							</div>
							<span className="font-semibold">WanderList</span>
						</NavLink>
					</div>

					{/* Right: Navigation links + Search */}
					<div className="flex flex-wrap items-center gap-4 ml-2">
						<NavigationMenuItem>
							<NavLink
								to="/"
								className={({ isActive }) =>
									`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										isActive
											? "border-b-2 border-primary text-primary"
											: "border-transparent text-muted-foreground hover:text-foreground hover:bg-primary/10"
									}`
								}
							>
								Map
							</NavLink>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavLink
								to="/destinations"
								onClick={() => setSidebarOpen(false)}
								className={({ isActive }) =>
									`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										isActive
											? "border-b-2 border-primary text-primary"
											: "border-transparent text-muted-foreground hover:text-foreground hover:bg-primary/10"
									}`
								}
							>
								All Destinations
							</NavLink>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavLink
								to="/stats"
								className={({ isActive }) =>
									`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										isActive
											? "border-b-2 border-primary text-primary"
											: "border-transparent text-muted-foreground hover:text-foreground hover:bg-primary/10"
									}`
								}
							>
								Stats
							</NavLink>
						</NavigationMenuItem>

						{/* Add Destination button */}
						<NavigationMenuItem>
							<button
								onClick={onAddDestination}
								className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
							>
								<Plus className="w-4 h-4" />
								Add Destination
							</button>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<SearchBar
								onSearch={onSearch}
								onDebounce={onDebounce}
								results={results}
								loading={loading}
								error={error}
								onResultClick={onResultClick}
							/>
						</NavigationMenuItem>

						{/* User dropdown */}
						<div className="relative">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary">
										<User2 className="w-5 h-5" /> {/* user icon */}
										{username}
									</button>
								</DropdownMenuTrigger>

								<DropdownMenuContent side="bottom" align="end" className="w-40 rounded-md border p-2 shadow-md">
									<DropdownMenuItem
										onClick={() => {
											localStorage.removeItem("token");
											localStorage.removeItem("username");
											setIsAuth?.(false);
										}}
									>
										Sign out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</NavigationMenuList>
			</NavigationMenu>
		</header>
	);
}