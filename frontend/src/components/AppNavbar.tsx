import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import type { SearchResult } from "@/hooks/useSearchDestinations";
import { SidebarTrigger } from "./ui/sidebar";
import SearchBar from "./searchbar/SearchBar";

interface AppNavbarProps {
	onSearch: (query: string) => void;
	onDebounce: (query: string) => void;
	results: SearchResult[];
	loading: boolean;
	error: Error | null;
	onResultClick: (lat: string, lon: string) => void;
}

export default function AppNavbar({
	onSearch,
	onDebounce,
	results,
	loading,
	error,
	onResultClick,
}: AppNavbarProps) {
	return (
		<header className="border-b bg-background">
			<NavigationMenu className="w-full p-4">
				<NavigationMenuList className="flex w-full items-center justify-between">
					{/* Left: sidebar toggle + app title */}
					<div className="flex items-center gap-2">
						<SidebarTrigger />
						<h1 className="font-semibold text-lg">Travel Planner</h1>
					</div>

					{/* Right: Destinations + Search */}
					<div className="flex items-center gap-4">
						<NavigationMenuItem>
							<NavigationMenuTrigger>Destinations</NavigationMenuTrigger>
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
					</div>
				</NavigationMenuList>
			</NavigationMenu>
		</header>
	);
}
