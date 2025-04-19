"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AQICard from "@/components/AQICard";
import XPProgress from "@/components/XPProgress";
import MissionCard from "@/components/MissionCard";
import BadgeBar from "@/components/BadgeBar";

export default function DashboardPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/login");
		}
	}, [status, router]);

	if (status === "loading") {
		return <div className="flex justify-center items-center min-h-screen text-xl text-gray-600">Loading your dashboard...</div>;
	}

	const missions = [
		{ title: "Plant a Tree", description: "Plant one sapling in your neighborhood", completed: true },
		{ title: "Carpool to Work", description: "Share a ride with at least 2 people", completed: false },
		{ title: "Recycle Plastic", description: "Recycle 1kg of plastic waste", completed: false },
	];

	const badges = ["Eco Warrior", "Green Thumb", "Nature Ninja"];

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 px-4 py-10">
			<div className="max-w-6xl mx-auto space-y-10">
				{/* Welcome Section */}
				<div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
					<h1 className="text-3xl font-bold text-gray-800 mb-1">
						Welcome, {session?.user?.name || "Explorer"} 👋
					</h1>
					<p className="text-gray-600 mb-6 text-base">
						You're on a mission to protect the planet. Let’s dive into today’s goals!
					</p>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="bg-green-100 p-4 rounded-lg shadow-inner">
							<h2 className="text-lg font-semibold text-green-800">XP Points</h2>
							<p className="text-xl mt-1">🏅 340 XP</p>
						</div>
						<div className="bg-blue-100 p-4 rounded-lg shadow-inner">
							<h2 className="text-lg font-semibold text-blue-800">Completed Missions</h2>
							<p className="text-xl mt-1">✅ 12</p>
						</div>
						<div className="bg-purple-100 p-4 rounded-lg shadow-inner">
							<h2 className="text-lg font-semibold text-purple-800">Current Streak</h2>
							<p className="text-xl mt-1">🔥 4 days</p>
						</div>
					</div>

					<div className="mt-6">
						<button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-all shadow">
							+ Start New Mission
						</button>
					</div>
				</div>

				{/* Highlights */}
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					<AQICard city="Bengaluru" aqi={85} />
					<XPProgress level={3} xp={120} goal={250} />
					<BadgeBar badges={badges} />
				</div>

				{/* Missions */}
				<div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
					<h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Missions</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
						{missions.map((m, i) => (
							<MissionCard key={i} {...m} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
