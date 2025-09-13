import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export function useDeleteDestination() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axios.delete(`${API_URL}/api/destinations/${id}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["destinations"] });
		},
	});
}
