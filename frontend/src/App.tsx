import { useState } from "react";
import Map from "@/components/map/Map";
import Login from "./app/(auth)/login/page";
import Signup from "./app/(auth)/signup/page";
import Sidebar from "./components/sidebar/Sidebar";
import SidebarToggle from "./components/sidebar/SidebarToggle";
import type { Destination } from "@/types/destination";
import { useUpdateDestination } from "./hooks/useUpdateDestination";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function App() {
	const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
	const [showSignup, setShowSignup] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const { data: destinations = [] } = useQuery<Destination[]>({
		queryKey: ["destinations"],
		queryFn: async () => {
			const res = await axios.get("http://localhost:5000/api/destinations", {
				headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
			});
			return res.data.destinations as Destination[];
		},
	});
	
	const handleDelete = () => {
		// optionally call backend to delete
	};

	const { mutate: updateDestination } = useUpdateDestination();
	const handleEdit = (id: string, updates: Partial<Destination>) => {
		updateDestination({ id, updates });
	};

	if (!isAuth) {
		return (
			<div className="h-screen flex flex-col justify-center items-center gap-4">
				{showSignup ? (
					<Signup onSuccess={() => setIsAuth(true)} />
				) : (
					<Login onSuccess={() => setIsAuth(true)} />
				)}
				<button
					className="text-blue-500 underline"
					onClick={() => setShowSignup(!showSignup)}
				>
					{showSignup
						? "Already have an account? Login"
						: "Don’t have an account? Signup"}
				</button>
			</div>
		);
	}

	return (
		<div className="flex h-screen w-screen overflow-hidden">
			{/* Sidebar */}
			<Sidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				destinations={destinations} // ← pass your state
				onDelete={handleDelete}
				onEdit={handleEdit}
			/>

			{/* Map Area */}
			<div className="flex-1 relative z-0 overflow-hidden">
				<Map destinations={destinations} />
			</div>

			{/* Toggle button (floating) */}
			<SidebarToggle
				isOpen={isSidebarOpen}
				onToggle={() => setIsSidebarOpen((prev) => !prev)}
			/>
		</div>
	);
}

export default App;
