import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SearchResult } from "@/hooks/useSearchDestinations";

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
	const [open, setOpen] = useState(false);
	const [highlighted, setHighlighted] = useState(-1);

	const formRef = useRef<HTMLFormElement>(null);

	// debounce
	useEffect(() => {
		const timeout = setTimeout(() => {
			if (query.trim()) {
				onDebounce(query.trim());
			} else {
				onDebounce("");
			}
		}, 500);
		return () => clearTimeout(timeout);
	}, [query, onDebounce]);

	// reset highlight when results change
	useEffect(() => {
		setHighlighted(-1);
	}, [results]);

	// close on outside click
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
				onFocus={() => {
					if (query.trim() && results.length > 0) {
						setOpen(true);
					}
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
					} else if (
						(e.key === "ArrowRight" || e.key === "Tab") &&
						highlighted >= 0
					) {
						e.preventDefault();
						const r = results[highlighted];
						setQuery(r.display_name);
					} else if (e.key === "Enter" && highlighted >= 0) {
						e.preventDefault();
						const r = results[highlighted];
						onResultClick(r.lat, r.lon);
						setOpen(false);
					}
				}}
				placeholder="Search location..."
				className="w-72 md:w-96 lg:w-[500px]"
			/>

			{query && (
				<button
					type="button"
					onClick={() => {
						setQuery("");
						onDebounce("");
						setOpen(false);
					}}
					className="absolute right-21 text-gray-400 hover:text-gray-600"
				>
					×
				</button>
			)}

			<Button type="submit" size="sm">
				Search
			</Button>

			{/* Dropdown results */}
			{open && (loading || error || results.length > 0) && (
				<div className="absolute top-full left-0 mt-1 w-full bg-white shadow-md rounded-md z-50">
					{loading && (
						<p className="text-xs p-2 text-muted-foreground">Searching…</p>
					)}
					{error && <p className="text-xs p-2 text-red-500">{error.message}</p>}
					<ul>
						{results.slice(0, 3).map((r, idx) => (
							<li
								key={idx}
								className={`p-2 cursor-pointer ${
									highlighted === idx ? "bg-accent" : "hover:bg-accent"
								}`}
								onMouseEnter={() => setHighlighted(idx)}
								onClick={() => {
									onResultClick(r.lat, r.lon);
									setOpen(false);
								}}
							>
								{r.display_name}
							</li>
						))}
					</ul>
				</div>
			)}
		</form>
	);
}
