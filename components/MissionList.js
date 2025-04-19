"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";

// Markdown styling
const markdownComponents = {
	p: ({ children }) => <p className="mb-2 text-gray-800">{children}</p>,
	h3: ({ children }) => (
		<h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
	),
	li: ({ children }) => <li className="list-disc ml-6">{children}</li>,
};

export default function MissionList({ missions = [] }) {
	if (!missions.length) {
		return (
			<p className="text-center text-gray-500 mt-10">
				No missions available.
			</p>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{missions.map((mission, index) => (
				<Card
					key={index}
					className="rounded-2xl shadow-md p-4 bg-white hover:shadow-xl transition-shadow">
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

						{mission.steps?.length > 0 && (
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

						<div className="text-sm text-green-800 bg-green-50 p-3 rounded-lg mt-2">
							<ReactMarkdown
								rehypePlugins={[
									rehypeRaw,
									rehypeSanitize,
									rehypeHighlight,
								]}
								components={markdownComponents}>
								{mission.reward || "*No reward specified.*"}
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
								<span className="text-gray-500">No tags</span>
							)}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
