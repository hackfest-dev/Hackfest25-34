// At the top of your file
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getLiveUserData } from "@/lib/getLiveUserData";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import mongoose from "mongoose";
import { useRouter } from "next/navigation";

const markdownComponents = {
	p: ({ children }) => <p className="mb-2 text-gray-800">{children}</p>,
	h3: ({ children }) => (
		<h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
	),
	li: ({ children }) => <li className="list-disc ml-6">{children}</li>,
};

export default function MissionDashboardPage() {
	const [loading, setLoading] = useState(false);
	const [missions, setMissions] = useState([]);
	const [error, setError] = useState(null);
	const { data: session } = useSession();
	const userId = session?.user?.id;
	const router = useRouter();

	const generateMission = async () => {
		setLoading(true);
		setError(null);
		try {
			const userData = await getLiveUserData();
			if (!userData) throw new Error("Failed to get user data.");

			const res = await fetch("/api/missions/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userId: userId || "guest",
					userData,
				}),
			});

			if (!res.ok) throw new Error("Gemini failed: " + res.statusText);
			const newMission = await res.json();

			if (newMission?.title || newMission?.description) {
				// Immediately save the mission after generating
				await saveMission(newMission);
				setMissions((prev) => [newMission, ...prev]);
			} else {
				throw new Error("Invalid mission format received.");
			}
		} catch (err) {
			console.error(err);
			setError("Error generating mission: " + err.message);
		} finally {
			setLoading(false);
		}
	};

	// Function to save the mission after it’s generated
	const saveMission = async (newMission) => {
		try {
			// Ensure userId is either a valid ObjectId or "guest"
			const userId =
				newMission.userId === "guest"
					? "guest"
					: new mongoose.Types.ObjectId(newMission.userId);

			const response = await fetch("/api/store-mission", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: newMission.title,
					description: newMission.description,
					steps: newMission.steps,
					reward: newMission.reward,
					funFact: newMission.funFact,
					tags: newMission.tags,
					userId: userId, // Send the properly handled userId
				}),
			});

			const data = await response.json();
			if (data.success) {
				console.log("Mission saved successfully!");
			} else {
				console.log("Error saving mission");
			}
		} catch (error) {
			console.error("Error saving mission:", error);
		}
	};

	useEffect(() => {
		if (missions.length === 0) {
			generateMission();
		}
	}, []);

	return (
		<div className="max-w-6xl mx-auto py-10 px-4">
			<div>
				<h1>Mission Page</h1>
				{missions.length > 0 ? (
					<div>
						{missions.map((mission, index) => (
							<div key={index}>
								<h2>{mission.title}</h2>
								<p>{mission.description}</p>
								<ul>
									{mission.steps.map((step, idx) => (
										<li key={idx}>{step}</li>
									))}
								</ul>
								<button onClick={() => generateMission()}>
									Generate New Mission
								</button>
							</div>
						))}
					</div>
				) : (
					<p>No mission available. Please generate one.</p>
				)}
			</div>

			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">🌱 Your Missions</h1>
				<Button
					onClick={generateMission}
					disabled={loading}>
					{loading ? (
						<>
							<Loader2 className="animate-spin mr-2 h-4 w-4" />
							Generating...
						</>
					) : (
						"Generate Mission"
					)}
				</Button>
			</div>

			{error && <p className="text-red-500 text-center">{error}</p>}

			{missions.length === 0 && !loading && (
				<p className="text-gray-500 text-center mt-20">
					No missions yet. Click “Generate Mission” to get started!
				</p>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{missions.map((mission, index) => (
					<Card
						key={index}
						className="rounded-2xl shadow-lg p-4 bg-white cursor-pointer hover:shadow-xl transition"
						onClick={() =>
							router.push(`/submit?missionId=${mission._id}`)
						}>
						<CardContent>
							<div className="text-xl font-semibold mb-2">
								<ReactMarkdown
									rehypePlugins={[
										rehypeRaw,
										rehypeSanitize,
										rehypeHighlight,
									]}
									components={markdownComponents}>
									{mission.title || "🌍 Untitled Mission"}
								</ReactMarkdown>
							</div>

							<div className="mb-4 text-gray-700 space-y-2">
								<ReactMarkdown
									rehypePlugins={[
										rehypeRaw,
										rehypeSanitize,
										rehypeHighlight,
									]}
									components={markdownComponents}>
									{mission.description ||
										"*No description provided.*"}
								</ReactMarkdown>
							</div>
							{mission.steps && (
								<>
									<h3 className="font-medium text-gray-800">
										Steps:
									</h3>
									<ReactMarkdown
										rehypePlugins={[
											rehypeRaw,
											rehypeSanitize,
											rehypeHighlight,
										]}
										components={markdownComponents}>
										{mission.steps.join("\n")}
									</ReactMarkdown>
								</>
							)}

							<div className="text-sm text-green-800 bg-green-50 p-3 rounded-lg mt-2 space-y-2">
								<ReactMarkdown
									rehypePlugins={[
										rehypeRaw,
										rehypeSanitize,
										rehypeHighlight,
									]}
									components={markdownComponents}>
									{mission.reward || "No reward specified."}
								</ReactMarkdown>
							</div>

							<div className="flex flex-wrap gap-2 mt-4">
								{mission.tags?.length > 0 ? (
									mission.tags.map((tag, i) => (
										<span
											key={i}
											className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
											#{tag}
										</span>
									))
								) : (
									<span className="text-gray-500">
										No tags
									</span>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
