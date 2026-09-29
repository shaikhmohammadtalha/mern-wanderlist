import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Map from "@/components/map/Map";
import Login from "./app/(auth)/login/page";
import Signup from "./app/(auth)/signup/page";
import DestinationsPage from "./app/destination/Destination";
import type { Destination } from "@/types/destination";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "./components/sidebar/AppSidebar";
import AppNavbar from "./components/AppNavbar";
import SearchBar from "./components/searchbar/SearchBar";
import StatsPage from "./components/stats/StatsPage";
import AddDestinationPopup from "./components/map/AddDestinationPopup";
import SearchResultsPanel from "@/components/search/SearchResultsPanel";
import OnboardingTour from "./components/OnboardingTour";
import {
  useCreateDestination,
  useUpdateDestination,
  useDeleteDestination,
  useDestinations,
  useSearchDestinations,
} from "@/hooks/useDestinations";
import { useAuth } from "./context/AuthContext";

type LatLng = { lat: number; lng: number };

/** Everything behind login. Split out so data hooks don't fire for logged-out users. */
function AuthedApp() {
  const [tourOpen, setTourOpen] = useState(
    () => localStorage.getItem("wanderlist_new_user") === "1",
  );
  useEffect(() => {
    localStorage.removeItem("wanderlist_new_user");
  }, []);

  const [activeDestinationId, setActiveDestinationId] = useState<string | null>(
    null,
  );

  const { destinations } = useDestinations();
  const { mutate: deleteDestination } = useDeleteDestination();
  const { mutate: updateDestination } = useUpdateDestination();
  const { mutate: createDestination } = useCreateDestination();

  const handleDelete = (id: string) => deleteDestination(id);
  const handleEdit = (id: string, updates: Partial<Destination>) =>
    updateDestination({ id, updates });

  // Search: live suggestions (debounced) vs. submitted results panel
  const [suggestQuery, setSuggestQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const suggestions = useSearchDestinations(suggestQuery);
  const submitted = useSearchDestinations(submittedQuery);
  const [searchLocation, setSearchLocation] = useState<LatLng | null>(null);

  const goToResult = (lat: string, lon: string) =>
    setSearchLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });

  // Add-destination popup
  const [selectedPos, setSelectedPos] = useState<LatLng | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualLocation, setManualLocation] = useState<LatLng | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const openAddDestination = () => {
    setSelectedPos(null);
    setManualMode(true);
    setManualLocation({ lat: 0, lng: 0 });
    setPopupOpen(true);
  };

  const closeAddDestination = () => {
    setPopupOpen(false);
    setManualLocation(null);
    setSelectedPos(null);
    setManualMode(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar
        destinations={destinations}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onFocus={setActiveDestinationId}
        onAddDestination={openAddDestination}
      />

      <SidebarInset className="h-dvh min-h-0 overflow-hidden">
        <AppNavbar
          onAddDestination={openAddDestination}
          search={
            <SearchBar
              onSearch={setSubmittedQuery}
              onDebounce={setSuggestQuery}
              results={suggestions.results}
              loading={suggestions.loading}
              error={suggestions.error}
              onResultClick={goToResult}
            />
          }
        />

        <main className="relative z-0 min-h-0 flex-1 overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SearchResultsPanel
                    loading={submitted.loading}
                    error={submitted.error}
                    results={submitted.results}
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
                    onFocus={setActiveDestinationId}
                    searchLocation={searchLocation}
                    selectedPos={selectedPos}
                    setSelectedPos={setSelectedPos}
                    setManualMode={setManualMode}
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
                  onFocus={setActiveDestinationId}
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
              onSetManualLocation={setManualLocation}
              onSave={(data) =>
                createDestination(
                  { ...data },
                  { onSuccess: closeAddDestination },
                )
              }
            />
          )}
        </main>
      </SidebarInset>

      <OnboardingTour open={tourOpen} onOpenChange={setTourOpen} />
    </SidebarProvider>
  );
}

function App() {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return <AuthedApp />;
}

export default App;
