import { useState } from "react";
import Map from "@/components/map/Map";
import Login from "./app/(auth)/login/page";
import Signup from "./app/(auth)/signup/page";
import type { Destination } from "@/types/destination";
import { useUpdateDestination } from "./hooks/useUpdateDestination";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDeleteDestination } from "./hooks/useDeleteDestination";
import {
	SidebarProvider,
	SidebarInset,
} from "@/components/ui/sidebar";
import AppSidebar from "./components/sidebar/AppSidebar";
import AppNavbar from "./components/AppNavbar";
import { useSearchDestinations } from "./hooks/useSearchDestinations";

function App() {
	const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
	const [showSignup, setShowSignup] = useState(false);
	const [activeDestinationId, setActiveDestinationId] = useState<string | null>(
		null
	);

	const { data: destinations = [] } = useQuery<Destination[]>({
		queryKey: ["destinations"],
		queryFn: async () => {
			const res = await axios.get("http://localhost:5000/api/destinations", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			return res.data.destinations as Destination[];
		},
	});

	const { mutate: deleteDestination } = useDeleteDestination();
	const handleDelete = (id: string) => {
		deleteDestination(id);
	};
	const { mutate: updateDestination } = useUpdateDestination();
	const handleEdit = (id: string, updates: Partial<Destination>) => {
		updateDestination({ id, updates });
	};
	
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [submittedQuery, setSubmittedQuery] = useState("");
	const {
		results: suggestionResults,
		loading: suggestionLoading,
		error: suggestionError,
	} = useSearchDestinations(debouncedQuery);

	const {
		results: searchResults,
		loading,
		error,
	} = useSearchDestinations(submittedQuery);

	if (!isAuth) {
		return (
			<div className="h-screen flex flex-col justify-center items-center gap-4">
				{showSignup ? (
					<Signup onSuccess={() => setIsAuth(true)} />
				) : (
					<Login onSuccess={() => setIsAuth(true)} />
				)}
				<button
					className="text-blue-500 underline"
					onClick={() => setShowSignup(!showSignup)}
				>
					{showSignup
						? "Already have an account? Login"
						: "Don’t have an account? Signup"}
				</button>
			</div>
		);
	}

	return (
		<SidebarProvider>
			{/* Shadcn Sidebar */}
			<AppSidebar
				destinations={destinations}
				onDelete={handleDelete}
				onEdit={handleEdit}
				onFocus={(id) => setActiveDestinationId(id)}
			/>

			{/* Main content area that respects sidebar width */}
			<SidebarInset>
				{/* App Navbar */}
				<AppNavbar
					onSearch={(query) => setSubmittedQuery(query)} // manual search
					onDebounce={(query) => setDebouncedQuery(query)} // auto typing
					results={suggestionResults}
					loading={suggestionLoading}
					error={suggestionError}
				/>

				{/* Search results preview */}
				{(loading || error || searchResults.length > 0) && (
					<div className="mx-4 my-2 rounded-lg border bg-card shadow-sm max-h-60 overflow-y-auto">
						<h2 className="text-sm font-semibold px-3 py-2 border-b">
							Search Results
						</h2>

						{loading && (
							<p className="px-3 py-2 text-xs text-muted-foreground">
								Searching…
							</p>
						)}

						{error && (
							<p className="px-3 py-2 text-xs text-red-500">{error.message}</p>
						)}

						{searchResults.length > 0 && (
							<ul className="divide-y">
								{searchResults.map((r, idx) => (
									<li
										key={idx}
										className="px-3 py-2 text-sm hover:bg-accent/50 cursor-pointer transition-colors"
									>
										{r.display_name}
									</li>
								))}
							</ul>
						)}
					</div>
				)}

				<main className="flex-1 relative z-0 overflow-hidden">
					<Map
						destinations={destinations}
						activeDestinationId={activeDestinationId}
						onDelete={handleDelete}
						onFocus={(id) => setActiveDestinationId(id)}
					/>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

export default App;
