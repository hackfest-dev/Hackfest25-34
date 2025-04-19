"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Save, RefreshCcw } from "lucide-react"; // Icons

const filterSubmissions = (subs, filters) => {
	return subs.filter((s) => {
		const labelMatch = filters.label
			? s.aiData?.labels?.some((l) => l.label === filters.label)
			: true;
		const cityMatch = filters.city ? s.location?.city === filters.city : true;
		const aqiMatch = filters.aqi ? String(s.airData?.aqi) === filters.aqi : true;
		return labelMatch && cityMatch && aqiMatch;
	});
};

const downloadCSV = (data) => {
	const header = [
		"Image URL",
		"AI Labels",
		"City",
		"Lat",
		"Lon",
		"AQI",
		"PM2.5",
		"Submitted At",
	];
	const rows = data.map((s) => [
		s.mediaUrl,
		s.aiData?.labels?.map((l) => l.label).join("|") || "N/A",
		s.location?.city || "N/A",
		s.location?.coordinates[1],
		s.location?.coordinates[0],
		s.airData?.aqi,
		s.airData?.pm25,
		new Date(s.createdAt).toLocaleString(),
	]);
	const csvContent = [header, ...rows].map((r) => r.join(",")).join("\n");
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", "submissions.csv");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

export default function AdminDashboard() {
	const [submissions, setSubmissions] = useState([]);
	const [filters, setFilters] = useState({ label: "", city: "", aqi: "" });
	const [statuses, setStatuses] = useState({});
	const [notes, setNotes] = useState({});

	useEffect(() => {
		fetch("/api/admin/submission")
			.then((res) => res.json())
			.then(setSubmissions);
	}, []);

	const handleReanalyze = async (id) => {
		const res = await fetch(`/api/admin/reanalyze?id=${id}`, {
			method: "POST",
		});
		const updated = await res.json();
		setSubmissions((prev) =>
			prev.map((s) =>
				s._id === id ? { ...s, aiData: updated.aiData } : s
			)
		);
	};

	const handleSaveAdminData = async (id) => {
		await fetch(`/api/admin/updateSubmission`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id,
				adminStatus: statuses[id],
				adminNotes: notes[id],
			}),
		});
	};

	const filtered = filterSubmissions(submissions, filters);
	const allLabels = submissions.flatMap(
		(s) => s.aiData?.labels?.map((l) => l.label) || []
	);
	const uniqueLabels = [...new Set(allLabels)].filter(Boolean);
	const uniqueCities = [
		...new Set(submissions.map((s) => s.location?.city).filter(Boolean)),
	];
	const uniqueAQIs = [
		...new Set(submissions.map((s) => String(s.airData?.aqi)).filter(Boolean)),
	];

	return (
		<div className="p-6 space-y-8">
			<h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>

			{/* Filters Section */}
			<div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-end">
				<select
					className="border p-2 rounded w-48"
					value={filters.label}
					onChange={(e) => setFilters({ ...filters, label: e.target.value })}
				>
					<option value="">All Labels</option>
					{uniqueLabels.map((l) => (
						<option key={l} value={l}>
							{l}
						</option>
					))}
				</select>
				<select
					className="border p-2 rounded w-48"
					value={filters.city}
					onChange={(e) => setFilters({ ...filters, city: e.target.value })}
				>
					<option value="">All Cities</option>
					{uniqueCities.map((c) => (
						<option key={c} value={c}>
							{c}
						</option>
					))}
				</select>
				<select
					className="border p-2 rounded w-48"
					value={filters.aqi}
					onChange={(e) => setFilters({ ...filters, aqi: e.target.value })}
				>
					<option value="">All AQI</option>
					{uniqueAQIs.map((a) => (
						<option key={a} value={a}>
							{a}
						</option>
					))}
				</select>
				<button
					className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
					onClick={() => downloadCSV(filtered)}
				>
					<Download className="w-4 h-4" />
					Export CSV
				</button>
			</div>

			{/* Submissions */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filtered.map((s) => (
					<div
						key={s._id}
						className="bg-white border rounded-xl shadow p-4 flex flex-col justify-between"
					>
						<Image
							src={s.mediaUrl}
							alt="Submitted"
							width={400}
							height={250}
							className="rounded-lg object-cover w-full h-56"
						/>
						<div className="mt-3 space-y-2 text-sm">
							<p><strong>Submitted:</strong> {new Date(s.createdAt).toLocaleString()}</p>
							<p><strong>Labels:</strong> {s.aiData?.labels?.map((l) => l.label).join(", ")}</p>
							<p><strong>Advanced:</strong> {s.aiData?.advancedAnalysis || "N/A"}</p>
							<p><strong>Location:</strong> {s.location?.city || "Unknown"} ({s.location?.coordinates[1]}, {s.location?.coordinates[0]})</p>
							<p><strong>Weather:</strong> {s.weather?.description} - {s.weather?.temp}°C</p>
							<p><strong>AQI:</strong> {s.airData?.aqi} (PM2.5: {s.airData?.pm25})</p>
							
							<textarea
								className="w-full p-2 border rounded text-sm"
								rows={2}
								placeholder="Admin Notes"
								value={notes[s._id] || ""}
								onChange={(e) =>
									setNotes((prev) => ({
										...prev,
										[s._id]: e.target.value,
									}))
								}
							/>

							<select
								className="border rounded p-2 w-full text-sm"
								value={statuses[s._id] || ""}
								onChange={(e) =>
									setStatuses((prev) => ({
										...prev,
										[s._id]: e.target.value,
									}))
								}
							>
								<option value="">Set Status</option>
								<option value="approved">✅ Approve</option>
								<option value="rejected">❌ Reject</option>
								<option value="flagged">⚠️ Flag</option>
							</select>

							<div className="flex gap-2 mt-3">
								<button
									className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
									onClick={() => handleSaveAdminData(s._id)}
								>
									<Save className="w-4 h-4" /> Save
								</button>
								<button
									className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
									onClick={() => handleReanalyze(s._id)}
								>
									<RefreshCcw className="w-4 h-4" /> Re-analyze
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
