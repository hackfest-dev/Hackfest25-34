"use client";

import { useState } from "react";

export default function UploadForm({ userId }) {
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("litter");
	const [type, setType] = useState("photo");
	const [uploading, setUploading] = useState(false);

	const [location, setLocation] = useState({ lat: 0, lng: 0 });

	// You can add geolocation fetch here
	const fetchLocation = () => {
		navigator.geolocation.getCurrentPosition((pos) => {
			setLocation({
				lat: pos.coords.latitude,
				lng: pos.coords.longitude,
			});
		});
	};

	const handleFileChange = (e) => {
		const selected = e.target.files?.[0];
		if (selected) {
			setFile(selected);
			setPreview(URL.createObjectURL(selected));
		}
	};

	const handleSubmit = async () => {
		if (!file) return alert("Please select a photo");
		setUploading(true);

		// Step 1: Upload image to Cloudinary
		const formData = new FormData();
		formData.append("file", file);

		const uploadRes = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});

		const { url } = await uploadRes.json();

		// Step 2: Save submission in MongoDB
		await fetch("/api/submission", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				userId,
				type,
				mediaUrl: url,
				description,
				location,
				category,
			}),
		});

		setUploading(false);
		alert("Submission uploaded!");
		setFile(null);
		setPreview(null);
		setDescription("");
	};

	return (
		<div className="space-y-4">
			<button
				onClick={fetchLocation}
				className="bg-blue-500 px-4 py-1 text-white rounded">
				Use Current Location
			</button>
			<input
				type="file"
				accept="image/*"
				onChange={handleFileChange}
			/>
			{preview && (
				<img
					src={preview}
					alt="Preview"
					className="w-64 rounded"
				/>
			)}
			<textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Describe your submission"
				className="w-full p-2 border rounded"
			/>
			<select
				value={category}
				onChange={(e) => setCategory(e.target.value)}
				className="w-full p-2 border rounded">
				<option value="litter">Litter</option>
				<option value="pollution">Pollution</option>
				<option value="wildlife">Wildlife</option>
			</select>
			<select
				value={type}
				onChange={(e) => setType(e.target.value)}
				className="w-full p-2 border rounded">
				<option value="photo">Photo</option>
				<option value="noise">Noise</option>
				<option value="observation">Observation</option>
			</select>
			<button
				onClick={handleSubmit}
				disabled={uploading}
				className="bg-green-600 text-white px-4 py-2 rounded">
				{uploading ? "Uploading..." : "Submit"}
			</button>
		</div>
	);
}
