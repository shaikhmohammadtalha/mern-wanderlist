import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface AuthResponse {
	token: string;
	user: { id: string; firstName: string; lastName: string; email: string };
}

export default function Signup({ onSuccess }: { onSuccess: () => void }) {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const mutation = useMutation<AuthResponse, Error>({
		mutationFn: async () => {
			const res = await fetch("http://localhost:5000/api/auth/signup", {
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
			onSuccess();
		},
	});

	return (
		<div className="flex flex-col gap-4 max-w-sm mx-auto mt-10 p-6 border rounded-lg">
			<h2 className="text-xl font-bold">Signup</h2>
			<input
				type="text"
				placeholder="First Name"
				className="border p-2 rounded"
				value={firstName}
				onChange={(e) => setFirstName(e.target.value)}
			/>
			<input
				type="text"
				placeholder="Last Name"
				className="border p-2 rounded"
				value={lastName}
				onChange={(e) => setLastName(e.target.value)}
			/>
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
				className="bg-green-500 text-white py-2 rounded"
			>
				{mutation.isPending ? "Signing up..." : "Signup"}
			</button>
			{mutation.isError && (
				<p className="text-red-500">{mutation.error.message}</p>
			)}
		</div>
	);
}
