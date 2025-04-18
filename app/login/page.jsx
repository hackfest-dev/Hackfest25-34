"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleCredentialsLogin = async (e) => {
		e.preventDefault();
		await signIn("credentials", { email, password, callbackUrl: "/" });
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen space-y-4">
			<h1 className="text-2xl font-bold">Login</h1>
			<form
				onSubmit={handleCredentialsLogin}
				className="space-y-2">
				<input
					type="email"
					placeholder="Email"
					className="border px-3 py-2"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					className="border px-3 py-2"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white px-4 py-2">
					Login
				</button>
			</form>

			<hr className="w-1/2 my-4" />
			<button
				className="bg-red-500 text-white px-4 py-2"
				onClick={() => signIn("google", { callbackUrl: "/" })}>
				Sign in with Google
			</button>
		</div>
	);
}
