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
import { Routes, Route, Navigate } from "react-router-dom";
import StatsPage from "./components/stats/StatsPage";
import DestinationsPage from "./app/(auth)/destination/Destination";
import { useCreateDestination } from "@/hooks/useDestinations";
import AddDestinationPopup from "./components/map/AddDestinationPopup";

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

	const [searchLocation, setSearchLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	const [sidebarOpen, setSidebarOpen] = useState(true); // default open on desktop

	const [selectedPos, setSelectedPos] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [manualMode, setManualMode] = useState(false);
	const [manualLocation, setManualLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [popupOpen, setPopupOpen] = useState(false);

	const { mutate: createDestination } = useCreateDestination();

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
				onAddDestination={() => {
					setSelectedPos(null); // clear map click
					setManualMode(true); // enable manual entry
					setManualLocation({ lat: 0, lng: 0 }); // or leave null if you prefer blank
					setPopupOpen(true); // open the AddDestinationPopup
				}}
			/>

			{/* Main content area that respects sidebar width */}
			<SidebarInset className="flex flex-col h-screen overflow-hidden">
				{/* App Navbar */}
				<AppNavbar
					onSearch={(query) => setSubmittedQuery(query)}
					onDebounce={(query) => setDebouncedQuery(query)}
					results={suggestionResults}
					loading={suggestionLoading}
					error={suggestionError}
					onResultClick={(lat, lon) =>
						setSearchLocation({ lat: parseFloat(lat), lng: parseFloat(lon) })
					}
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
					onAddDestination={() => {
						setSelectedPos(null);
						setManualMode(true);
						setManualLocation(null);
						setPopupOpen(true);
					}}
				/>

				{/* Search results preview */}
				{(loading || error || searchResults.length > 0) && (
					<div className="mx-4 my-2 rounded-lg border bg-card shadow-sm max-h-60 overflow-y-auto z-10">
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
										onClick={() =>
											setSearchLocation({
												lat: parseFloat(r.lat),
												lng: parseFloat(r.lon),
											})
										}
									>
										{r.display_name}
									</li>
								))}
							</ul>
						)}
					</div>
				)}
				<main className="flex-1 relative z-0 overflow-y-auto">
					<Routes>
						{/* Home → Map */}
						<Route
							path="/"
							element={
								<Map
									destinations={destinations}
									activeDestinationId={activeDestinationId}
									onDelete={handleDelete}
									onFocus={(id) => setActiveDestinationId(id)}
									searchLocation={searchLocation}
									selectedPos={selectedPos}
									setSelectedPos={setSelectedPos}
									manualMode={manualMode}
									setManualMode={setManualMode}
									manualLocation={manualLocation}
									setManualLocation={setManualLocation}
									popupOpen={popupOpen}
									setPopupOpen={setPopupOpen}
								/>
							}
						/>

						{/* Stats Page */}
						<Route
							path="/stats"
							element={<StatsPage destinations={destinations} />}
						/>

						{/* Redirect any unknown URL */}
						<Route path="*" element={<Navigate to="/" replace />} />
						<Route
							path="/destinations"
							element={
								<DestinationsPage
									destinations={destinations}
									onDelete={handleDelete}
									onEdit={handleEdit}
									onFocus={(id) => setActiveDestinationId(id)}
								/>
							}
						/>
					</Routes>

					{popupOpen && (
						<AddDestinationPopup
							open={popupOpen}
							onOpenChange={setPopupOpen}
							mapCoordinates={selectedPos ?? searchLocation ?? null}
							manualMode={manualMode}
							manualLocation={manualLocation}
							onSetManualMode={setManualMode}
							onSetManualLocation={setManualLocation}
							onSave={(data) =>
								createDestination(
									{ ...data },
									{
										onSuccess: () => {
											setPopupOpen(false);
											setManualLocation(null);
											setSelectedPos(null);
											setManualMode(false);
										},
									}
								)
							}
						/>
					)}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

export default App;
