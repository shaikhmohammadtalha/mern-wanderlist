import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface SearchResult {
	display_name: string;
	lat: string;
	lon: string;
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
		enabled: !!query, // don’t run unless query is non-empty
	});

	return { results, loading, error };
}
