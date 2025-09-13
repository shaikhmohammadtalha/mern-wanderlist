import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "leaflet/dist/leaflet.css";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import SeoHelmet from "./components/SeoHelmet.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<HelmetProvider>
					<SeoHelmet />
					<AuthProvider>
						<App />
					</AuthProvider>
				</HelmetProvider>
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>
);
