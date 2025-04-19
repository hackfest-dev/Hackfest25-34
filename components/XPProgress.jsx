"use client";

export default function XPProgress({ level = 2, xp = 150, goal = 300 }) {
	const percentage = Math.min((xp / goal) * 100, 100);
	return (
		<div className="bg-gray-200 rounded-2xl p-4 shadow-md">
			<h2 className="text-lg font-bold mb-2">Level {level}</h2>
			<div className="w-full bg-gray-300 h-4 rounded-full">
				<div
					className="bg-green-500 h-4 rounded-full"
					style={{ width: `${percentage}%` }}></div>
			</div>
			<p className="mt-1 text-sm">XP: {xp}/{goal}</p>
		</div>
	);
}
