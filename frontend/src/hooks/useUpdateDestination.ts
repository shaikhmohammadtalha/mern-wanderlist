import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useUpdateDestination() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
			const res = await axios.patch(
				`http://localhost:5000/api/destinations/${id}`,
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
