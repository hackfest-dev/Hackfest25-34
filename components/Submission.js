"use client";

import { useEffect, useState } from "react";

export default function UploadForm({ userId }) {
	const [files, setFiles] = useState([]);
	const [previews, setPreviews] = useState([]);
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("litter");
	const [type, setType] = useState("photo");
	const [uploading, setUploading] = useState(false);
	const [lastAiData, setLastAiData] = useState(null);

	const [location, setLocation] = useState({ lat: 0, lng: 0 });
	const [airData, setAirData] = useState(null);
	const [weather, setWeather] = useState(null); // optional, if you want weather too

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(async (pos) => {
			const loc = {
				lat: pos.coords.latitude,
				lng: pos.coords.longitude,
			};
			setLocation(loc);

			const res = await fetch(
				`/api/environmental?lat=${loc.lat}&lng=${loc.lng}`
			);
			const data = await res.json();

			setAirData(data.air);
			setWeather(data.weather); // if you're using weather too
		});
	}, []);

	const handleFileChange = (e) => {
		const selected = Array.from(e.target.files);
		setFiles(selected);
		setPreviews(selected.map((file) => URL.createObjectURL(file)));
	};

	const handleSubmit = async () => {
		if (files.length === 0) return alert("Select at least one file");
		if (!location.lat || !airData)
			return alert("Location and air data not ready");

		setUploading(true);

		for (let file of files) {
			const formData = new FormData();
			formData.append("file", file);

			const uploadRes = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const { url } = await uploadRes.json();

			const res = await fetch("/api/submission", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId,
					type,
					mediaUrl: url,
					description,
					location,
					category,
					airData,
					weather, // optional
				}),
			});
			const data = await res.json();
			setLastAiData(data.submission?.aiData || null);
		}

		setUploading(false);
		alert("All submissions uploaded!");
		setFiles([]);
		setPreviews([]);
		setDescription("");
	};

	return (
		<div className="space-y-4">
			<input
				type="file"
				multiple
				accept="image/*"
				onChange={handleFileChange}
			/>
			{previews.map((src, i) => (
				<img
					key={i}
					src={src}
					alt={`Preview ${i}`}
					className="w-32 rounded"
				/>
			))}

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
			{lastAiData?.labels?.length > 0 && (
				<div className="mt-4 p-4 border rounded bg-gray-100">
					<h4 className="font-semibold">AI Detected Labels:</h4>
					<ul className="list-disc ml-5">
						{lastAiData.labels.map((item, index) => (
							<li key={index}>
								{item.label} ({(item.score * 100).toFixed(1)}%)
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
