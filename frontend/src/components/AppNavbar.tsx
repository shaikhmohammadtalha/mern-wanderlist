import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import type { SearchResult } from "@/hooks/useSearchDestinations";
import { useEffect, useRef, useState } from "react";
import { SidebarTrigger } from "./ui/sidebar";

interface AppNavbarProps {
	onSearch: (query: string) => void; // manual search
	onDebounce: (query: string) => void; // auto debounce
	results: SearchResult[];
	loading: boolean;
	error: Error | null;
}

export default function AppNavbar({
	onSearch,
	onDebounce,
	results,
	loading,
	error,
}: AppNavbarProps) {
	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const input = form.search as HTMLInputElement;
		if (input.value.trim()) {
			onSearch(input.value.trim());
			input.value = "";
		}
	};

	const [query, setQuery] = useState("");

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (query.trim()) {
				onDebounce(query.trim()); // debounce suggestions
			} else {
				onDebounce(""); // clear suggestions if input is empty
			}
		}, 500);
		return () => clearTimeout(timeout);
	}, [query, onDebounce]);

	const [open, setOpen] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (formRef.current && !formRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<header className="border-b bg-background">
			<NavigationMenu className="w-full p-4">
				<NavigationMenuList className="flex w-full items-center justify-between">
					{/* Left: sidebar toggle + app title */}
					<div className="flex items-center gap-2">
						<SidebarTrigger />
						<h1 className="font-semibold text-lg">Travel Planner</h1>
					</div>

					{/* Right: search + optional Destinations trigger */}
					<div className="flex items-center gap-4">
						{/* Destinations trigger */}
						<NavigationMenuItem>
							<NavigationMenuTrigger>Destinations</NavigationMenuTrigger>
						</NavigationMenuItem>
						{/* Search form */}
						<NavigationMenuItem>
							<form
								ref={formRef}
								onSubmit={handleSearch}
								className="relative flex items-center gap-2"
							>
								<Input
									id="search"
									name="search"
									type="text"
									value={query}
									onChange={(e) => {
										setQuery(e.target.value);
										setOpen(true);
									}}
									placeholder="Search location..."
									className="w-72 md:w-96 lg:w-[500px]"
								/>

								<Button type="submit" size="sm">
									Search
								</Button>

								{/* Dropdown results */}
								{open && (loading || error || results.length > 0) && (
									<div className="absolute top-full left-0 mt-1 w-full bg-white shadow-md rounded-md z-50">
										{loading && (
											<p className="text-xs p-2 text-muted-foreground">
												Searching…
											</p>
										)}
										{error && (
											<p className="text-xs p-2 text-red-500">
												{error.message}
											</p>
										)}
										<ul>
											{results.slice(0, 3).map((r, idx) => (
												<li
													key={idx}
													className="p-2 hover:bg-accent cursor-pointer"
												>
													{r.display_name}
												</li>
											))}
										</ul>
									</div>
								)}
							</form>
						</NavigationMenuItem>
					</div>
				</NavigationMenuList>
			</NavigationMenu>
		</header>
	);
}
