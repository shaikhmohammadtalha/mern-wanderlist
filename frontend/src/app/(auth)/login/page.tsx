import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

interface AuthResponse {
	token: string;
	user: { id: string; firstName: string; lastName: string; email: string };
}

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { setIsAuth } = useAuth();
	const navigate = useNavigate();

	const mutation = useMutation<AuthResponse, Error>({
		mutationFn: async () => {
			const res = await fetch(`${API_URL}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			if (!res.ok) throw new Error("Login failed");
			return res.json();
		},
		onSuccess: (data) => {
			localStorage.setItem("token", data.token);
			localStorage.setItem("username", data.user.firstName);
			setIsAuth(true);
			navigate("/", { replace: true });
		},
	});

	return (
		<div className="flex items-center justify-center min-h-screen">
			<Card className="w-full max-w-md shadow-md border border-gray-200 ">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						Welcome back
					</CardTitle>
					<p className="text-sm text-center text-muted-foreground mt-1">
						Sign in to access your account on WanderList.
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
								className="mt-2 peer border-gray-300"
							/>
						</div>

						{/* Login Button */}
						<Button
							type="submit"
							className="w-full mt-2 py-2 rounded-lg"
							disabled={mutation.isPending}
						>
							{mutation.isPending ? "Logging in..." : "Login"}
						</Button>
					</form>

					{/* Error Message */}
					{mutation.isError && (
						<p className="text-center mt-3 text-sm font-medium text-red-600">
							❌ {mutation.error.message}
						</p>
					)}

					<p className="text-center text-sm mt-6">
						Don’t have an account?{" "}
						<Link
							to="/signup"
							className="font-medium hover:text-primary hover:underline"
						>
							Sign up
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
