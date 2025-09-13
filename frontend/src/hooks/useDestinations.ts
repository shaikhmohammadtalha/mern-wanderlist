import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Destination } from "@/types/destination";
import { useAuth } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

/* ------------------ Types ------------------ */
type NewDestination = Omit<Destination, "id" | "createdAt" | "editedAt">;

export interface SearchResult {
	display_name: string;
	lat: string;
	lon: string;
}

/* ------------------ Queries ------------------ */
export function useDestinations() {
	const { isAuth } = useAuth();

	const {
		data: destinations = [],
		isLoading,
		error,
	} = useQuery<Destination[]>({
		queryKey: ["destinations"],
		queryFn: async () => {
			const token = localStorage.getItem("token");
			const res = await axios.get(`${API_URL}/api/destinations`, {
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});
			return res.data.destinations as Destination[];
		},
		enabled: isAuth,
	});

	return { destinations, isLoading, error };
}

export function useSearchDestinations(query: string) {
	const {
		data: results = [],
		isLoading: loading,
		error,
	} = useQuery<SearchResult[]>({
		queryKey: ["search", query],
		queryFn: async () => {
			const res = await axios.get<SearchResult[]>(
				"https://nominatim.openstreetmap.org/search",
				{
					params: {
						q: query,
						format: "json",
						addressdetails: 1,
						limit: 10,
					},
				}
			);
			return res.data;
		},
		enabled: !!query, // only run if query is non-empty
	});

	return { results, loading, error };
}

/* ------------------ Mutations ------------------ */
export function useCreateDestination() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (newDest: NewDestination) => {
			const token = localStorage.getItem("token");

			const res = await axios.post(`${API_URL}/api/destinations`, newDest, {
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});
			return res.data.destination;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["destinations"] });
		},
	});
}

export function useUpdateDestination() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
			const token = localStorage.getItem("token");

			const res = await axios.patch(
				`${API_URL}/api/destinations/${id}`,
				updates,
				{
					headers: token ? { Authorization: `Bearer ${token}` } : {},
				}
			);
			return res.data.destination;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["destinations"] });
		},
	});
}

export function useDeleteDestination() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const token = localStorage.getItem("token");

			const res = await axios.delete(`${API_URL}/api/destinations/${id}`, {
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			});
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["destinations"] });
		},
	});
}
