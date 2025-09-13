import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export function useUpdateDestination() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
			const res = await axios.patch(
				`${API_URL}/api/destinations/${id}`,
				updates,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				}
			);
			return res.data.destination;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["destinations"] });
		},
	});
}
