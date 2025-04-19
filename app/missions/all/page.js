"use client";

import { useState, useEffect } from "react";
import MissionList from "@/components/MissionList";

export default function AllMissionsPage() {
	const [missions, setMissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchAllMissions = async () => {
		try {
			const res = await fetch("/api/get-all-missions");
			const data = await res.json();

			if (data.success) {
				setMissions(data.missions);
			} else {
				setError(data.message || "Failed to fetch missions.");
			}
		} catch (err) {
			console.error(err);
			setError("Error fetching missions: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAllMissions();
	}, []);

	return (
		<div className="max-w-6xl mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold text-center mb-8">
				All Available Missions
			</h1>

			{error && <p className="text-red-500 text-center">{error}</p>}
			{!loading && missions.length > 0 && (
				<MissionList missions={missions} />
			)}
			{!loading && missions.length === 0 && !error && (
				<p className="text-gray-500 text-center mt-20">
					No missions found.
				</p>
			)}
		</div>
	);
}
