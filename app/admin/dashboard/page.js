"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

export default function AdminDashboard() {
	const [submissions, setSubmissions] = useState([]);

	useEffect(() => {
		fetch("/api/admin/submission")
			.then((res) => res.json())
			.then(setSubmissions);
	}, []);

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">Admin Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{submissions.map((s) => (
					<div
						key={s._id}
						className="border rounded-xl shadow p-4">
						<Image
							src={s.mediaUrl}
							alt="Submitted Image"
							width={400}
							height={250}
							className="rounded-lg object-cover w-full"
						/>

						<div className="mt-3 space-y-1 text-sm">
							<p>
								<strong>Submitted:</strong>{" "}
								{new Date(s.createdAt).toLocaleString()}
							</p>
							<p>
								<strong>AI Result:</strong>{" "}
								{s.aiResult?.label || "Pending"}
							</p>
							<p>
								<strong>Location:</strong>{" "}
								{s.location?.city || "Unknown"} (
								{s.location?.lat}, {s.location?.lon})
							</p>
							<p>
								<strong>Weather:</strong>{" "}
								{s.weather?.description} - {s.weather?.temp}°C
							</p>
							<p>
								<strong>Air Quality:</strong> AQI{" "}
								{s.airData?.aqi} ({s.airData?.pm25})
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
