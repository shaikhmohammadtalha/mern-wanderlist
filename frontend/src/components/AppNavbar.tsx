import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { MapPin, Plus, User2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { SearchResult } from "@/hooks/useDestinations";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "./searchbar/SearchBar";

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

function NavItem({ to, children, onClick }: { to: string; children: ReactNode; onClick?: () => void }) {
	return (
		<NavLink
			to={to}
			onClick={onClick}
			className={({ isActive }) =>
				`inline-flex items-center whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium transition-colors ${
					isActive
						? "border-b-2 border-primary text-primary"
						: "border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-primary/10"
				}`
			}
		>
			{children}
		</NavLink>
	);
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

	const handleSignOut = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("username");
		setIsAuth?.(false);
	};

	return (
		<header className="sticky top-0 z-50 w-full min-w-0 overflow-x-clip border-b bg-white/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/90">
			{/* Full desktop navbar. xl = 1280px, so the crowded middle widths use the compact layout below. */}
			<div className="hidden min-w-0 items-center gap-3 px-4 py-2 xl:flex xl:h-16 xl:py-0">
				{/* Left */}
				<div className="flex shrink-0 items-center gap-2">
					<SidebarTrigger
						className="shrink-0"
						onClick={() => setSidebarOpen(!sidebarOpen)}
					/>

					{!sidebarOpen && (
						<NavLink
							to="/"
							className="flex shrink-0 items-center gap-2 transition-colors hover:text-primary"
						>
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground">
								<MapPin className="h-4 w-4" />
							</div>
							<span className="whitespace-nowrap font-semibold">WanderList</span>
						</NavLink>
					)}
				</div>

				{/* Center navigation */}
				<nav className="flex shrink-0 items-center gap-1" aria-label="Primary navigation">
					<NavItem to="/">Map</NavItem>
					<NavItem to="/destinations" onClick={() => setSidebarOpen(false)}>
						All Destinations
					</NavItem>
					<NavItem to="/stats">Stats</NavItem>
				</nav>

				{/* Right side. Search is the only flexible element. */}
				<div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2">
					<button
						type="button"
						onClick={onAddDestination}
						className="flex shrink-0 items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
					>
						<Plus className="h-4 w-4" />
						<span className="whitespace-nowrap">Add Destination</span>
					</button>

					<div className="min-w-0 flex-1 max-w-[360px]">
						<SearchBar
							onSearch={onSearch}
							onDebounce={onDebounce}
							results={results}
							loading={loading}
							error={error}
							onResultClick={onResultClick}
						/>
					</div>

					<div className="relative shrink-0">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap hover:bg-primary/10 hover:text-primary">
									<User2 className="h-5 w-5" />
									{username}
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="bottom" align="end" className="w-40 rounded-md border p-2 shadow-md">
								<DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>

			{/* Compact tablet/mobile navbar. Navigation lives in the sidebar drawer. */}
			<div className="flex w-full min-w-0 flex-col gap-2 px-3 py-2 xl:hidden">
				<div className="flex min-w-0 w-full items-center gap-2">
					<SidebarTrigger
						className="shrink-0"
						onClick={() => setSidebarOpen(!sidebarOpen)}
					/>

					<NavLink to="/" className="flex min-w-0 items-center gap-2">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground">
							<MapPin className="h-4 w-4" />
						</div>
						<span className="truncate font-semibold">WanderList</span>
					</NavLink>

					<div className="relative ml-auto shrink-0">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									aria-label={`Open ${username} profile menu`}
									className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-primary/10 hover:text-primary"
								>
									<User2 className="h-5 w-5" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="bottom" align="end" className="w-40 rounded-md border p-2 shadow-md">
								<DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<div className="w-full min-w-0">
					<SearchBar
						onSearch={onSearch}
						onDebounce={onDebounce}
						results={results}
						loading={loading}
						error={error}
						onResultClick={onResultClick}
					/>
				</div>
			</div>
		</header>
	);
}
