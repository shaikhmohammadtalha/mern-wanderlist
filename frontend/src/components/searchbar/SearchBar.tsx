import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SearchResult } from "@/hooks/useDestinations";

interface SearchBarProps {
	onSearch: (query: string) => void;
	onDebounce: (query: string) => void;
	results: SearchResult[];
	loading: boolean;
	error: Error | null;
	onResultClick: (lat: string, lon: string) => void;
}

export default function SearchBar({
	onSearch,
	onDebounce,
	results,
	loading,
	error,
	onResultClick,
}: SearchBarProps) {
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [highlighted, setHighlighted] = useState(-1);
	const formRef = useRef<HTMLFormElement>(null);

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const input = form.elements.namedItem("search") as HTMLInputElement | null;

		if (input?.value.trim()) {
			onSearch(input.value.trim());
			setOpen(false);
		}
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			onDebounce(query.trim());
		}, 500);

		return () => clearTimeout(timeout);
	}, [query, onDebounce]);

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
		<form
			ref={formRef}
			onSubmit={handleSearch}
			className="relative flex w-full min-w-0 items-center gap-2"
		>
			<div className="relative min-w-0 flex-1">
				<Input
					id="search"
					name="search"
					type="text"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setHighlighted(-1);
						setOpen(true);
					}}
					onFocus={() => {
						if (query.trim() && results.length > 0) setOpen(true);
					}}
					onKeyDown={(e) => {
						if (!open || results.length === 0) return;

						if (e.key === "ArrowDown") {
							e.preventDefault();
							setHighlighted((prev) => (prev + 1) % results.length);
						} else if (e.key === "ArrowUp") {
							e.preventDefault();
							setHighlighted((prev) =>
								prev <= 0 ? results.length - 1 : prev - 1
							);
						} else if ((e.key === "ArrowRight" || e.key === "Tab") && highlighted >= 0) {
							e.preventDefault();
							setQuery(results[highlighted].display_name);
						} else if (e.key === "Enter" && highlighted >= 0) {
							e.preventDefault();
							const result = results[highlighted];
							onResultClick(result.lat, result.lon);
							setOpen(false);
						}
					}}
					placeholder="Search location..."
					className="w-full min-w-0 rounded-xl border border-input bg-background/90 pr-9 backdrop-blur supports-[backdrop-filter]:bg-background/60 placeholder:text-muted-foreground transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
				/>

				{query && (
					<button
						type="button"
						aria-label="Clear search"
						onClick={() => {
							setQuery("");
							setHighlighted(-1);
							onDebounce("");
							setOpen(false);
						}}
						className="absolute right-2 top-1/2 -translate-y-1/2 text-lg leading-none text-muted-foreground hover:text-foreground/70"
					>
						×
					</button>
				)}
			</div>

			<Button type="submit" size="sm" className="shrink-0 px-3">
				Search
			</Button>

			{open && (loading || error || results.length > 0) && (
				<div className="absolute left-0 top-full z-[60] mt-2 w-full rounded-xl border border-border bg-card shadow-lg">
					{loading && <p className="p-2 text-xs text-muted-foreground">Searching…</p>}
					{error && <p className="p-2 text-xs text-destructive">{error.message}</p>}

					<ul className="divide-y divide-border">
						{results.slice(0, 3).map((result, idx) => (
							<li
								key={`${result.lat}-${result.lon}-${idx}`}
								className={`cursor-pointer px-3 py-2 text-sm ${
									highlighted === idx ? "bg-accent" : "hover:bg-accent/50"
								}`}
								onMouseEnter={() => setHighlighted(idx)}
								onClick={() => {
									onResultClick(result.lat, result.lon);
									setOpen(false);
								}}
							>
								{result.display_name}
							</li>
						))}
					</ul>
				</div>
			)}
		</form>
	);
}
