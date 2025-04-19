"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import UploadForm from "@/components/Submission";
import AQICard from "@/components/AQICard";
import BadgeBar from "@/components/BadgeBar";
import MissionCard from "@/components/MissionCard";
import XPProgress from "@/components/XPProgress";

export default function Home() {
	const [imageUrl, setImageUrl] = useState("");
	const [labels, setLabels] = useState([]);
	const [missions] = useState([
		{ title: "Plant a Tree", description: "Plant one sapling in your neighborhood", completed: true },
		{ title: "Carpool to Work", description: "Share a ride with at least 2 people", completed: false },
		{ title: "Recycle Plastic", description: "Recycle 1kg of plastic waste", completed: false },
	]);
	const [badges] = useState(["Eco Warrior", "Green Thumb", "Nature Ninja"]);

	const analyzeImage = async () => {
		if (!imageUrl) return;
		const res = await fetch("/api/analyze", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ imageUrl }),
		});
		const data = await res.json();
		setLabels(data.labels || []);
	};

	return (
		<>
			<Header className="py-4 text-2xl" /> {/* Slightly bigger Header */}

			<main className="pb-24 p-4 max-w-xl mx-auto space-y-6">
				{/* AQI Display */}
				<AQICard city="Bengaluru" aqi={85} />

				{/* XP Progress */}
				<XPProgress level={3} xp={120} goal={250} />

				{/* Badges */}
				<BadgeBar badges={badges} />

				{/* Image Upload Section */}
				<div className="bg-white p-4 rounded-2xl shadow-md">
					<h2 className="text-lg font-semibold mb-2">Upload Image for Analysis</h2>
					<UploadForm setImageUrl={setImageUrl} />
					{imageUrl && analyzeImage()}
				</div>

				{/* Image Analysis Results */}
				{labels.length > 0 && (
					<div className="bg-white p-4 rounded-lg shadow-md">
						<h3 className="text-base font-semibold mb-2">Image Analysis Results</h3>
						<ul className="list-disc pl-5 text-sm text-gray-700">
							{labels.map((label, index) => (
								<li key={index}>{label}</li>
							))}
						</ul>
					</div>
				)}

				{/* Missions */}
				<div className="bg-white p-4 rounded-2xl shadow-md">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">Your Missions</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{missions.map((m, i) => (
							<MissionCard key={i} {...m} />
						))}
					</div>
				</div>
			</main>

			{/* Bottom Navigation Bar */}
			<Navbar />
		</>
	);
}
