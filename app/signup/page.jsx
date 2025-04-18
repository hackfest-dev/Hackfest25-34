"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

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
		<div className="flex flex-col items-center justify-center h-screen space-y-4">
			<h1 className="text-2xl font-bold">Register</h1>
			{error && <p className="text-red-500">{error}</p>}
			<form
				onSubmit={handleRegister}
				className="space-y-2">
				<input
					name="name"
					placeholder="Name"
					className="border px-3 py-2"
					onChange={handleChange}
					required
				/>
				<input
					name="email"
					type="email"
					placeholder="Email"
					className="border px-3 py-2"
					onChange={handleChange}
					required
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					className="border px-3 py-2"
					onChange={handleChange}
					required
				/>
				<button
					type="submit"
					className="bg-green-600 text-white px-4 py-2">
					Register
				</button>
			</form>
		</div>
	);
}
