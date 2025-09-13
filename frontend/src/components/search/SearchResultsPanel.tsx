interface SearchResult {
	display_name: string;
	lat: string;
	lon: string;
}

interface Props {
	loading: boolean;
	error: any;
	results: SearchResult[];
	onSelect: (lat: number, lng: number) => void;
	onClose: () => void;
}

export default function SearchResultsPanel({
	loading,
	error,
	results,
	onSelect,
	onClose,
}: Props) {
	if (!loading && !error && results.length === 0) return null;

	return (
		<div className="mx-4 my-2 rounded-lg border bg-card shadow-sm max-h-60 overflow-y-auto z-10">
			{/* Header with title + close button */}
			<div className="flex justify-between items-center px-3 py-2 border-b">
				<h2 className="text-sm font-semibold">Search Results</h2>
				<button
					onClick={onClose}
					className="text-xs text-muted-foreground hover:text-red-500"
				>
					✕
				</button>
			</div>

			{loading && (
				<p className="px-3 py-2 text-xs text-muted-foreground">Searching…</p>
			)}

			{error && (
				<p className="px-3 py-2 text-xs text-red-500">{error.message}</p>
			)}

			{results.length > 0 && (
				<ul className="divide-y">
					{results.map((r, idx) => (
						<li
							key={idx}
							className="px-3 py-2 text-sm hover:bg-accent/50 cursor-pointer transition-colors"
							onClick={() => onSelect(parseFloat(r.lat), parseFloat(r.lon))}
						>
							{r.display_name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
