import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useDeleteDestination() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axios.delete(
				`http://localhost:5000/api/destinations/${id}`,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				}
			);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["destinations"] });
		},
	});
}
