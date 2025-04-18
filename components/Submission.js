"use client";
import ReactMarkdown from "react-markdown";

import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify"; // for safety (prevent XSS)
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

			// Fetch air + weather
			const envRes = await fetch(
				`/api/environmental?lat=${loc.lat}&lng=${loc.lng}`
			);
			const envData = await envRes.json();
			setAirData(envData.air);
			setWeather(envData.weather);

			// Fetch address info
			const geoRes = await fetch(
				`/api/reverse-geocode?lat=${loc.lat}&lng=${loc.lng}`
			);
			const geoData = await geoRes.json();
			setLocation((prev) => ({
				...prev,
				country: geoData.country,
				state: geoData.state,
				city: geoData.city,
				village: geoData.village,
			}));
		});
	}, []);

	async function getAddressFromCoords(lat, lng) {
		const res = await fetch(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
		);
		const data = await res.json();

		const address = data.address || {};
		const components = data.results[0].components;

		return NextResponse.json({
			country: components.country || "",
			state: components.state || "",
			city: components.city || components.town || components.county || "",
			village: components.village || components.town || "",
		});
	}

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

		const { lat, lng } = location;

		// 1. Get detailed location info
		const extraLocation = await getAddressFromCoords(lat, lng);

		// 2. Build the full location object (GeoJSON + extra fields)
		const fullLocation = {
			type: "Point",
			coordinates: [lng, lat],
			...extraLocation,
		};

		// 3. Loop through selected files and upload them
		for (let file of files) {
			const formData = new FormData();
			formData.append("file", file);

			const uploadRes = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const { url } = await uploadRes.json();

			// 4. Submit full data to your backend
			const res = await fetch("/api/submission", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId,
					type,
					mediaUrl: url,
					description,
					location: {
						type: "Point",
						coordinates: [location.lng, location.lat],
						country: location.country,
						state: location.state,
						city: location.city,
						village: location.village,
					},
					category,
					airData,
					weather,
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
			{/* {lastAiData?.advancedAnalysis && (
				<div className="mt-4 p-4 border rounded bg-yellow-100">
					<h4 className="font-semibold">Gemini Insight:</h4>
					<div
						className="prose max-w-none"
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(
								marked.parse(lastAiData.advancedAnalysis)
							),
						}}
					/>
				</div>
			)} */}
		</div>
	);
}
