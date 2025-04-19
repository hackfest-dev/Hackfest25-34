"use client";

import { useState } from "react";

export default function CapturePage() {
	const [file, setFile] = useState(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const handleFileChange = (e) => setFile(e.target.files[0]);

	const handleSubmit = (e) => {
		e.preventDefault();
		// TODO: Send this data to the backend
		console.log({ file, title, description });
	};

	return (
		<main className="p-6 max-w-md mx-auto">
			<h1 className="text-2xl font-semibold mb-6 text-center">Capture Evidence</h1>

			<form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-lg">
				<input
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="border border-dashed border-gray-400 p-4 w-full rounded-lg"
				/>

				<input
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="border p-3 w-full rounded-lg"
					required
				/>

				<textarea
					placeholder="Description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="border p-3 w-full rounded-lg"
					rows={4}
					required
				/>

				<button
					type="submit"
					className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
				>
					Submit
				</button>
			</form>
		</main>
	);
}
