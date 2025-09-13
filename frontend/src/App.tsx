import { useState } from "react";
import Map from "@/components/map/Map";
import Login from "./app/(auth)/login/page";
import Signup from "./app/(auth)/signup/page";
import type { Destination } from "@/types/destination";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "./components/sidebar/AppSidebar";
import AppNavbar from "./components/AppNavbar";
import { Routes, Route, Navigate } from "react-router-dom";
import StatsPage from "./components/stats/StatsPage";
import DestinationsPage from "./app/destination/Destination";
import AddDestinationPopup from "./components/map/AddDestinationPopup";
import {
	useCreateDestination,
	useUpdateDestination,
	useDeleteDestination,
	useDestinations,
	useSearchDestinations,
} from "@/hooks/useDestinations";
import SearchResultsPanel from "@/components/search/SearchResultsPanel";
import { useAuth } from "./context/AuthContext";

function App() {

	const { isAuth } = useAuth();
	
	const [activeDestinationId, setActiveDestinationId] = useState<string | null>(
		null
	);

	const { destinations } = useDestinations();
	const { mutate: deleteDestination } = useDeleteDestination();
	const { mutate: updateDestination } = useUpdateDestination();
	const { mutate: createDestination } = useCreateDestination();

	const handleDelete = (id: string) => deleteDestination(id);
	const handleEdit = (id: string, updates: Partial<Destination>) =>
		updateDestination({ id, updates });

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
	const [sidebarOpen, setSidebarOpen] = useState(true);
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

	if (!isAuth) {
		// user not authenticated → only show login/signup pages
		return (
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		);
	}

	return (
		<SidebarProvider>
			<AppSidebar
				destinations={destinations}
				onDelete={handleDelete}
				onEdit={handleEdit}
				onFocus={(id) => setActiveDestinationId(id)}
				onAddDestination={() => {
					setSelectedPos(null);
					setManualMode(true);
					setManualLocation({ lat: 0, lng: 0 });
					setPopupOpen(true);
				}}
			/>

			<SidebarInset className="flex flex-col h-screen overflow-hidden">
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
						setManualLocation({ lat: 0, lng: 0 });
						setPopupOpen(true);
					}}
				/>

				<main className="flex-1 relative z-0 overflow-y-auto">
					<Routes>
						<Route
							path="/"
							element={
								<>
									<SearchResultsPanel
										loading={loading}
										error={error}
										results={searchResults}
										onSelect={(lat, lng) => setSearchLocation({ lat, lng })}
										onClose={() => {
											setSubmittedQuery("");
											setSearchLocation(null);
										}}
									/>
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
								</>
							}
						/>
						<Route
							path="/stats"
							element={<StatsPage destinations={destinations} />}
						/>
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
						<Route path="*" element={<Navigate to="/" replace />} />
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
