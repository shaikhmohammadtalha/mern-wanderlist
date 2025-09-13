import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
		<div className="flex items-center justify-center min-h-screen">
			<Card className="w-full max-w-lg shadow-md border border-gray-200 p-6">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Create your account
					</CardTitle>
					<p className="text-sm text-center text-muted-foreground mt-1">
						Sign up to start using WanderList.
					</p>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							mutation.mutate();
						}}
						className="space-y-5"
					>
						{/* First Name */}
						<div className="relative">
							<Label htmlFor="firstName">First Name</Label>
							<Input
								id="firstName"
								type="text"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								placeholder="Enter your first name"
								required
								className="mt-2 border-gray-300"
							/>
						</div>

						{/* Last Name */}
						<div className="relative">
							<Label htmlFor="lastName">Last Name</Label>
							<Input
								id="lastName"
								type="text"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								placeholder="Enter your last name"
								required
								className="mt-2 border-gray-300"
							/>
						</div>

						{/* Email */}
						<div className="relative">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								required
								className="mt-2 border-gray-300"
							/>
						</div>

						{/* Password */}
						<div className="relative">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								required
								className="mt-2 border-gray-300"
							/>
						</div>

						{/* Signup Button */}
						<Button
							type="submit"
							className="w-full mt-2 py-2 rounded-lg"
							disabled={mutation.isPending}
						>
							{mutation.isPending ? "Signing up..." : "Signup"}
						</Button>
					</form>

					{/* Error Message */}
					{mutation.isError && (
						<p className="text-center mt-3 text-sm font-medium text-red-600">
							❌ {mutation.error.message}
						</p>
					)}

					<p className="text-center text-sm mt-6">
						Already have an account?{" "}
						<Link
							to="/login"
							className="font-medium hover:text-primary hover:underline"
						>
							Login
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
