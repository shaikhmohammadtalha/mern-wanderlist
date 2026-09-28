import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

interface AuthResponse {
	token: string;
	user: { id: string; firstName: string; lastName: string; email: string };
}

export default function Signup() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { setIsAuth } = useAuth();
	const navigate = useNavigate();

	const mutation = useMutation<AuthResponse, Error>({
		mutationFn: async () => {
			const res = await fetch(`${API_URL}/api/auth/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ firstName, lastName, email, password }),
			});

			const data = await res.json(); // read backend error
			if (!res.ok) throw new Error(data.message || "Signup failed");
			return data;
		},
		onSuccess: (data) => {
			localStorage.setItem("token", data.token);
			setIsAuth(true);
			navigate("/", { replace: true });
		},
	});

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
			<div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-slate-200">
				<div className="text-center mb-6">
					<div className="mx-auto w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-medium mb-2">
						<div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
							<MapPin className="w-4 h-4" />
						</div>
					</div>
					<h1 className="text-2xl font-bold text-center">Create your account</h1>
					<p className="text-sm text-center text-muted-foreground mt-1">
						Sign up to start using WanderList.
					</p>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						mutation.mutate();
					}}
					className="space-y-6"
				>
					<div>
						<label className="block text-sm font-medium mb-2">First Name</label>
						<input
							type="text"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="Enter your first name"
							required
							className="w-full rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Last Name</label>
						<input
							type="text"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							placeholder="Enter your last name"
							required
							className="w-full rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
							className="w-full rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							required
							className="w-full rounded-xl border border-slate-300 px-4 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
						/>
					</div>

					<button
						type="submit"
						className="w-full rounded-xl bg-primary px-4 py-3 text-lg font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "Signing up..." : "Signup"}
					</button>

					{mutation.isError && (
						<p className="mt-3 text-sm font-medium text-destructive">
							❌ {mutation.error.message}
						</p>
					)}

					<p className="mt-6 text-sm">
						Already have an account?{" "}
						<a
							href="/login"
							className="font-medium hover:text-primary hover:underline"
						>
							Login
						</a>
					</p>
				</form>
			</div>
		</div>
	);
}