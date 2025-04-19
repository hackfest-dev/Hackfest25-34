"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import MissionDashboardPage from "@/components/Mission";
import MissionList from "@/components/MissionList";
const markdownComponents = {
	p: ({ children }) => <p className="mb-2 text-gray-800">{children}</p>,
	h3: ({ children }) => (
		<h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
	),
	li: ({ children }) => <li className="list-disc ml-6">{children}</li>,
};

export default function MissionPage() {
	const [loading, setLoading] = useState(false);
	const [missions, setMissions] = useState([]);
	const [error, setError] = useState(null);
	const { data: session } = useSession();
	const userId = session?.user?.id;
	console.log("User ID for fetch:", userId);

	// Fetch missions when the component mounts
	const fetchMissions = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(`/api/get-mission?userId=${userId}`);
			const data = await res.json();

			console.log("Fetched missions:", data); // Add this

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
		console.log("Session data:", session);
		if (userId) {
			fetchMissions();
		}
		console.log(userId); // Add this
	}, [userId, session]);

	return (
		<div className="max-w-6xl mx-auto py-10 px-4">
			<MissionList missions={missions} />
			{/* <MissionDashboardPage /> */}
			{/* <div>
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
							</div>
						))}
					</div>
				) : (
					<p>No mission available.</p>
				)}
			</div> */}

			{error && <p className="text-red-500 text-center">{error}</p>}

			{missions.length === 0 && !loading && (
				<p className="text-gray-500 text-center mt-20">
					No missions yet. Please check again later.
				</p>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{missions.map((mission, index) => (
					<Card
						key={index}
						className="rounded-2xl shadow-lg p-4 bg-white">
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
