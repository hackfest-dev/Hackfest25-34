"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
	const router = useRouter();
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		const res = await fetch("/api/register", {
			method: "POST",
			body: JSON.stringify(form),
			headers: { "Content-Type": "application/json" },
		});

		if (res.ok) {
			await signIn("credentials", {
				email: form.email,
				password: form.password,
				callbackUrl: "/",
			});
		} else {
			const msg = await res.text();
			setError(msg);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 via-blue-100 to-purple-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create an Account</h1>

				{error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

				<form onSubmit={handleRegister} className="space-y-4">
					<input
						name="name"
						placeholder="Full Name"
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
						onChange={handleChange}
						required
					/>
					<input
						name="email"
						type="email"
						placeholder="Email"
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
						onChange={handleChange}
						required
					/>
					<input
						name="password"
						type="password"
						placeholder="Password"
						className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
						onChange={handleChange}
						required
					/>
					<button
						type="submit"
						className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">
						Register
					</button>
				</form>

				<p className="mt-6 text-sm text-center text-gray-600">
					Already have an account?{" "}
					<Link href="/login" className="text-blue-600 hover:underline">
						Log in
					</Link>
				</p>
			</div>
		</div>
	);
}
