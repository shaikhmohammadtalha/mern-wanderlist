import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useCreateDestination() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (newDest: {
			name: string;
			coordinates: { lat: number; lng: number };
		}) => {
			const res = await axios.post(
				"http://localhost:5000/api/destinations",
				newDest,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				}
			);
			return res.data.destination;
		},
		onSuccess: () => {
			// ✅ Automatically refresh destinations list
			queryClient.invalidateQueries({ queryKey: ["destinations"] });
		},
	});
}
