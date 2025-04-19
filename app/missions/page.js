"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import MissionDashboardPage from "@/components/Mission";

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

	if (loading) return <p>Loading missions...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			<MissionDashboardPage
			{missions.map((mission, index) => (
				<Card
					key={index}
					className="rounded-2xl shadow-lg p-4 bg-white">
					<CardContent>
						<div className="text-xl font-semibold mb-2">
							<ReactMarkdown>
								{mission.title || "Untitled"}
							</ReactMarkdown>
						</div>
						<p className="text-sm text-gray-500 mb-2">
							<b>User:</b>{" "}
							{mission.userId?.name ||
								mission.userId?._id ||
								"Unknown"}
						</p>
						<div className="text-gray-700 mb-4">
							<ReactMarkdown>
								{mission.description || "No description"}
							</ReactMarkdown>
						</div>
						{mission.reward && (
							<p className="text-green-600 font-medium">
								Reward: {mission.reward}
							</p>
						)}
						{mission.steps && (
							<ul className="list-disc list-inside text-sm text-gray-700">
								{mission.steps.map((step, i) => (
									<li key={i}>{step}</li>
								))}
							</ul>
						)}
						{mission.tags && (
							<div className="text-xs text-blue-600 mt-2">
								Tags: {mission.tags.join(", ")}
							</div>
						)}
					</CardContent>
				</Card>
			))}
		</div>
	);
}
