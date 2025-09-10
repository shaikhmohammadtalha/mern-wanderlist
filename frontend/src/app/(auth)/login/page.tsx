import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface AuthResponse {
	token: string;
	user: { id: string; firstName: string; lastName: string; email: string };
}

export default function Login({ onSuccess }: { onSuccess: () => void }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const mutation = useMutation<AuthResponse, Error>({
		mutationFn: async () => {
			const res = await fetch("http://localhost:5000/api/auth/login", {
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
			onSuccess();
		},
	});

	return (
		<div className="flex flex-col gap-4 max-w-sm mx-auto mt-10 p-6 border rounded-lg">
			<h2 className="text-xl font-bold">Login</h2>
			<input
				type="email"
				placeholder="Email"
				className="border p-2 rounded"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password"
				className="border p-2 rounded"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button
				onClick={() => mutation.mutate()}
				className="bg-blue-500 text-white py-2 rounded"
			>
				{mutation.isPending ? "Logging in..." : "Login"}
			</button>
			{mutation.isError && (
				<p className="text-red-500">{mutation.error.message}</p>
			)}
		</div>
	);
}
