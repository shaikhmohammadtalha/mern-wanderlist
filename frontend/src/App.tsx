import { useState } from "react";
import Map from "@/components/map/Map";
import Login from "./app/(auth)/login/page";
import Signup from "./app/(auth)/signup/page";
import Sidebar from "./components/sidebar/Sidebar";
import SidebarToggle from "./components/sidebar/SidebarToggle";
import type { Destination } from "@/types/destination";

function App() {
	const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
	const [showSignup, setShowSignup] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [destinations, setDestinations] = useState<Destination[]>([]);
	const handleDelete = (id: string) => {
		setDestinations(destinations.filter((d) => d.id !== id));
		// optionally call backend to delete
	};

	const handleEdit = (id: string) => {
		setDestinations(destinations.filter((d) => d.id !== id));
		// open a modal or inline edit
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
				<Map destinations={destinations} setDestinations={setDestinations} />
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
