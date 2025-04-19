"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleCredentialsLogin = async (e) => {
		e.preventDefault();
		await signIn("credentials", { email, password, callbackUrl: "/" });
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 via-blue-100 to-purple-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login to EnviroQuest</h1>
				
				<form onSubmit={handleCredentialsLogin} className="space-y-4">
					<input
						type="email"
						placeholder="Email"
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Password"
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
						Login
					</button>
				</form>

				<div className="my-4 text-center text-sm text-gray-500">or</div>

				<button
					className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
					onClick={() => signIn("google", { callbackUrl: "/" })}>
					Sign in with Google
				</button>

				<p className="mt-6 text-sm text-center text-gray-600">
					Don't have an account?{" "}
					<Link href="/signup" className="text-blue-600 hover:underline">
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
