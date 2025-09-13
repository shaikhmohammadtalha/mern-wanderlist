import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import type { SearchResult } from "@/hooks/useSearchDestinations";
import { SidebarTrigger } from "./ui/sidebar";
import SearchBar from "./searchbar/SearchBar";
import { NavLink } from "react-router-dom";
import { Plus, User2 } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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
		<header className="border-b bg-background">
			<NavigationMenu className="w-full p-4">
				<NavigationMenuList className="w-full flex items-center justify-between">
					{/* Left: Sidebar toggle + app title */}
					<div className="flex items-center gap-2">
						<SidebarTrigger onClick={() => setSidebarOpen(!sidebarOpen)} />
						<NavLink to="/" className="font-semibold text-lg hover:underline">
							WanderList
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
											? "bg-accent text-accent-foreground"
											: "hover:bg-accent hover:text-accent-foreground"
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
											? "bg-accent text-accent-foreground"
											: "hover:bg-accent hover:text-accent-foreground"
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
											? "bg-accent text-accent-foreground"
											: "hover:bg-accent hover:text-accent-foreground"
									}`
								}
							>
								Stats
							</NavLink>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<button
								onClick={onAddDestination}
								className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10"
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
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
									<User2 className="w-5 h-5" /> {/* user icon */}
									{username}
								</button>
							</DropdownMenuTrigger>

							<DropdownMenuContent side="bottom" align="end" className="w-40">
								<DropdownMenuItem
									onClick={() => {
										localStorage.removeItem("token");
										localStorage.removeItem("username");
										setIsAuth?.(false); // make sure you pass setIsAuth from App.tsx to AppNavbar
									}}
								>
									Sign out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</NavigationMenuList>
			</NavigationMenu>
		</header>
	);
}
